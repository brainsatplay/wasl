import { LatestWASL, Options } from "./types"
import * as languages from './utils/languages'
import * as path from './utils/path'
import get from './get'
import * as check from './utils/check'
import getFnParamInfo from "./utils/parse"

const isSrc = (str) => {
    return typeof str === 'string' && Object.values(languages).find(arr => arr.includes(str.split('.').slice(-1)[0])) // Has supported extension
}

const merge = (main, override, deleteSrc=false) => {

    if (deleteSrc) {
        const ogSrc = override.src ?? override
        delete override.src
        if ('default' in ogSrc) return ogSrc.default // default export
    }
    
    return Object.assign(Object.assign({}, main), override) // named exports
}

const checkFiles = (key, filesystem) => {
    const isJSON = path.suffix(key).slice(-4) === "json" ? true : false;
    const output = isJSON && filesystem[key] ? JSON.parse(JSON.stringify(filesystem[key])) : filesystem[key];
    return output;
}

var remove = (original, search=original, key=original, o?)=> {
    console.error(`Source was not ${original ? `resolved for ${original}` : `specified for ${key}`}. ${search ? `If available, refer to this object directly as options.filesystem["${search}"]. ` : ''}${o ? `Automatically removing ${key} from the WASL file.` : ''}`);
    if (o) delete o[key];
  }

  const basePkgPath = './package.json'
  const onError = (e, {errors, warnings}) => {
      const item = {
          message: e.message, 
          file: e.file ?? basePkgPath,
          node: e.node,
      }

      
      const arr = (e.type === 'warning') ? warnings : errors
      arr.push(item)
  }

  let getSrc = async (target, info, options, {nodes = undefined, edges = undefined} = {}) => {

    const {
        relativeToResolved,
        mainPath,
        // object,
        url,
    } = info

    const isImportMode = !!url


    for (let name in target) {
        const node = target[name]
        const isObj = node && typeof node === 'object'

        if (isObj){
        let ogSrc = node.src ?? '';

        if (isSrc(ogSrc) || (nodes && edges && !ogSrc)){

            node.src = null
            // Option #1: Active ESM source (TODO: Fetch text for ambiguous interpretation, i.e. other languages)
            let passToNested = null
            let fullPath = (relativeToResolved) ? path.get(ogSrc, mainPath) : path.get(ogSrc, relativeToResolved)

            // Use Relative Paths
            if (isImportMode) {
                node.src = await get(fullPath) as LatestWASL
                passToNested = path.get(ogSrc, url, true)
            }
            
            // Direct + Fallback for Relative Paths
            if (!node.src) {
                if (options.filesystem) {
                    const res = checkFiles(fullPath, options.filesystem)
                    if (res) {
                        if (res.default || fullPath.includes('.json')) node.src = passToNested = res
                        else {
                            onError({
                                type: 'warning',
                                message: `Node (${name}) at ${fullPath} does not have a default export.`,
                                file: ogSrc
                            }, options)
                            node.src = passToNested = {default: res}
                        }
                    }
                    else remove(ogSrc, fullPath, name, target)

                } else {
                    onError({
                        message: 'No options.filesystem field to get JavaScript objects',
                        file: ogSrc
                    }, options)
                }
            } 
            
            // drill into nested graphs
            if (node.src && node.src.graph) node.src = await load(passToNested, {
                relativeTo: relativeToResolved || options.relativeTo,
                filesystem: options.filesystem,
                errors: options.errors,
                warnings: options.warnings,
                _internal: ogSrc,
                _deleteSrc: options._deleteSrc,
            }) 

        } else {

            for (let key in node) {

                    if (key === 'src') {

                        const language = node.src.language
                        if (!language || languages.js.includes(language)){

                        // Option #2: Import full ESM text in JSON object
                        if (node.src.text) {
                            const moduleDataURI = (text, mimeType='text/javascript') => `data:${mimeType};base64,` + btoa(text);
                            const esmImport = async (text) => {
                                try {
                                    let imported = await import(moduleDataURI(text))

                                    // NOTE: getting default may be wrong
                                    if (imported.default && Object.keys(imported).length === 1) imported = imported.default
                                    return imported
                                } catch (e) {
                                    onError({
                                        message:e.message,
                                        file:name // NOTE: Is wrong...
                                    }, options)
                                }
                            }
                            
                            const esm = await esmImport(node.src.text)
                            if (esm) {
                                delete node.src.text
                                node.src = Object.assign(node.src, esm)
                            } else {
                                onError({
                                    message: 'Could not import this text as ESM',
                                    file: node.src
                                }, options)
                            }
                        } 

                        // Option #3: Activate JS functions in JSON object
                        else {

                            const expectedFunctions = ['default', 'oncreate', 'onrender']
                            for (let key in node.src){
                                try {
                                    if (expectedFunctions.includes(key) && typeof node.src[key] === 'string') node.src[key] = (0, eval)(`(${node.src[key]})`)
                                } catch (e) {
                                    onError({
                                        message: `Field ${key} could not be parsed`,
                                        file: node.src[key]
                                    }, options)
                                }
                            }
                        }  
                    }

                    // Option #4: Allow downstream application to parse non-JS text
                    else {
                        console.warn(`Text is in ${language}, not JavaScript. This is not currently parsable automatically.`);
                        onError({
                            message: `Source is in ${language}. Currently only JavaScript is supported.`,
                            file: ogSrc
                        }, options)
                    }
                } 
                
                // Drill other object keys to replace and merge src...
                else if (typeof node[key] === 'object') {
                    const optsCopy = Object.assign({}, options) as Options
                    optsCopy._deleteSrc = true
                    await getSrc(node[key], info, optsCopy, {nodes: node[key]}) // check for src to merge
                }
            }
        }
        }
    }

        // Search the nodes that are produced for .src fields
        // to modify it

        // NOTE: If accompanied by an edges object, this is a full graph
        // and should throw errors

        for (let name in nodes){
            const node = nodes[name]

            // Merge and validate components
            if 
            (
                node?.src && 
                typeof node?.src === 'object' // Successfully loaded
            ) {

                // Check if stateless
                if (edges && node.src.default){
                    const fnString = node.src.default.toString()
                    const keyword = 'function'
                    if (fnString.slice(0, keyword.length) === keyword){
                        onError({
                            type: 'warning',
                            message: `Default export may be stateful.`,
                            node: name
                        }, options)
                    }
                }

                // Merge node.components info with the actual node (i.e. instance) information

                if (node.src.graph) {
                        for (let nestedName in node.components){
                                const nestedNode = node.src.graph.nodes[nestedName]
                                if (nestedNode) {
                                    if (node.components) {
                                        for (let key in node.components[nestedName]){
                                            const newInfo = node.components[nestedName][key]
                                            if (typeof newInfo === 'object') {

                                                // Properly merge the resolved src info
                                                const optsCopy = Object.assign({}, options) as Options
                                                optsCopy._deleteSrc = true

                                                const ogSrc = newInfo.src
                                                const newInfoForNode = (await getSrc({[key]: newInfo}, info, optsCopy, {
                                                    nodes: newInfo
                                                }))
                                                const newVal = newInfoForNode[key]

                                                if (newVal) {
                                                        const resVal =  newVal.src ?? newVal
                                                        const bothObj = typeof nestedNode[key] === 'object' && resVal && typeof resVal === 'object' 
                                                        nestedNode[key] = bothObj ? Object.assign(nestedNode[key] ?? {}, resVal) : resVal
                                                } else {
                                                    onError({
                                                        message: `Could not resolve ${ogSrc}`
                                                    }, options)
                                                }

                                                // Merge src (component info)
                                                node.src.graph.nodes[nestedName][key] = merge(nestedNode.src[key], nestedNode[key], true)


                                            } else console.error('[wasl-load] Component info is not an object...')
                                        }
                                    }
                                } else {
                                    onError({
                                        message: `Component target '${nestedName}' does not exist`,
                                        node: name
                                    }, options)
                                }

                        }

                } else {

                    // VALIDATE: Source files must have a default export
                    if (edges && !('default' in node.src)){
                        onError({
                            message: 'No default export.',
                            node: name
                        }, options)
                    } 
                    
                    // LOAD: Arguments // TODO: Make sure this doesn't conflict with things the user can pass in...
                    else {
                        const args = getFnParamInfo(node.src.default) ?? new Map()
                        
                        if (args.size === 0) args.set("default", {});

                        // merge with user-specified arguments
                        if (node.arguments) {
                          for (let key in node.arguments) {
                            const o = args.get(key)
                            o.state = node.arguments[key]
                          }
                        }
                        
                        // set arguments field
                        node.arguments = args
                    }
                }

                nodes[name] = merge(node.src, node, options._deleteSrc)

            }
        }


        // VALIDATE: Check that all edges point to valid nodes
        for (let output in edges){

            const getTarget = (o,str) => o.graph?.nodes?.[str] ?? o[str] ?? o.arguments.get(str)

            let outTarget = nodes
            output.split('.').forEach((str) => outTarget = getTarget(outTarget,str))
            if (!outTarget) {
                onError({
                    message: `Node '${output}' (output) does not exist to create an edge.`,
                    file: url,
                }, options)
            }

            for (let input in edges[output]){
                let inTarget = nodes
                input.split('.').forEach((str) => inTarget =  getTarget(inTarget, str))
                if (!inTarget) {
                    onError({
                        message: `Node '${input}' (input) does not exist to create an edge.`,
                        file: url,
                    }, options)
                }
            }
    }

    return target
  }

const load = async (
    urlOrObject: string | LatestWASL, 
    options: Options = {},
    urlArg: string = ''
) => {

    const clonedOptions = Object.assign({errors: [], warnings: []}, options)

    let { 
        relativeTo, 
        errors,
        warnings
    } = clonedOptions
    

    const isString = typeof urlOrObject === 'string'

    errors.push(...check.valid(urlOrObject, options, 'load'))

    let object, url = urlArg, relativeToResolved = ''; // catch internal calls
    if (url || (isString && relativeTo)) {
        if (!url) url = urlOrObject // Import Mode
        delete clonedOptions.filesystem
        relativeToResolved = relativeTo
    } else {
        object = Object.assign({}, urlOrObject) // Rseference Mode
        delete clonedOptions.relativeTo
        if (typeof clonedOptions._internal === 'string') relativeToResolved = path.get(clonedOptions._internal, clonedOptions.relativeTo)
    }

    let pkg; 

    const mainPath = await path.get(url, relativeToResolved) // maintain a reference to the main path (already resolved)

    // Import Mode
    if (url) {
        const main = await get(mainPath) as LatestWASL
        const pkgUrl = path.get(basePkgPath, mainPath, true)
        pkg = await get(pkgUrl).catch((e) => onError(e, {errors, warnings})) as any
        if (pkg) object = Object.assign(pkg, main) as any
    } 
    
    // Reference Mode
    else {

        if (clonedOptions.filesystem) {
            const pkgPath = path.get(basePkgPath, relativeToResolved)
            pkg = checkFiles(pkgPath, clonedOptions.filesystem)
            if (pkg) object = Object.assign(pkg, isString ? {} : object) as any
            else remove(basePkgPath, pkgPath)
        }

        // Try Loose Import Mode
        else {
            const pkgPath = path.get(basePkgPath, mainPath)
            if (relativeToResolved){
                pkg = await get(pkgPath).catch((e) => onError(e, {errors, warnings})) as any
                if (pkg) object = Object.assign(pkg,  isString ? {} : object) as any
            }
        }
    }

    if (errors.length === 0) {

        // replace src with actual source text
        const nodes = object.graph.nodes

        await getSrc(nodes, {
            mainPath,
            relativeToResolved,
            url,
            object,
        }, clonedOptions, object.graph)

        return object
    }

}


export default load