import { LatestWASL, Options } from "./types"
import * as languages from './utils/languages'
import * as path from './utils/path'
import get from './get'
import * as check from './utils/check'

// Options: 
//     - Provide a url and a options.relativeTo entry (locally served + Node.js only)
//     - Provide a file object and options.filesystem entry (any)

const checkFiles = (key, filesystem) => {
    const isJSON = path.suffix(key).slice(-4) === "json" ? true : false;
    const output = isJSON && filesystem[key] ? JSON.parse(JSON.stringify(filesystem[key])) : filesystem[key];
    return output;
}

var remove = (original, search=original, key=original, o?)=> {
    console.error(`Source was not ${original ? `resolved for ${original}` : `specified for ${key}`}. ${search ? `If available, refer to this object directly as options.filesystem["${search}"]. ` : ''}${o ? `Automatically removing ${key} from the WASL file.` : ''}`);
    if (o) delete o[key];
  }

const load = async (
    urlOrObject: string | LatestWASL, 
    options: Options = {}
) => {

    const clonedOptions = Object.assign({errors: [], warnings: []}, options)

    let { 
        relativeTo, 
        filesystem, 
        errors,
        warnings
    } = clonedOptions

    const isString = typeof urlOrObject === 'string'
    const relativePathMode = isString && 'relativeTo' in clonedOptions


    errors.push(...check.valid(urlOrObject, options, 'load'))
    const relativeToResolved = (clonedOptions._internal || relativePathMode) ? relativeTo : ''

    let pkg, o = Object.assign({}, urlOrObject) as any; // shallow copy to split references but keep functions
    const basePkgPath = './package.json'

    const mainPath = (relativePathMode) ? await path.get(urlOrObject, relativeToResolved) : '' // maintain a reference to the main path (already resolved)

    const onError = (e) => {
        const item = {
            message: e.message, 
            file: e.file ?? basePkgPath,
            node: e.node,
        }
        if (e.type === 'warning') warnings.push(item)
        else errors.push(item)
    }

    if (relativePathMode) {
        const main = await get(mainPath) as LatestWASL
        const pkgUrl = path.get(basePkgPath, urlOrObject, true)
        pkg = await get(pkgUrl, relativeToResolved).catch(onError) as any
        if (pkg) o = Object.assign(pkg, main) as any
    } else if (filesystem) {
        const pkgPath = path.get(basePkgPath, relativeToResolved)
        pkg = checkFiles(pkgPath, filesystem)
        if (pkg) o = Object.assign(pkg, isString ? {} : o) as any
        else remove(basePkgPath, pkgPath)
    }
    else {
        if (relativeToResolved){
            pkg = await get(basePkgPath, relativeToResolved).catch(onError) as any
            if (pkg) o = Object.assign(pkg,  isString ? {} : o) as any
        }
    }

    if (errors.length === 0) {

    // replace src with actual source text
    const nodes = o.graph.nodes
    for (let name in nodes) {
        const node = nodes[name]
        const ogSrc = node.src  ?? '';
        if (typeof ogSrc === 'string'){

            node.src = null
            // Option #1: Active ESM source (TODO: Fetch text for ambiguous interpretation, i.e. other languages)
            let passToNested = null
            let fullPath = (relativePathMode) ? path.get(ogSrc, mainPath) : path.get(ogSrc, relativeToResolved)
            
            // Use Relative Paths
            if (relativePathMode) {
                node.src = await get(fullPath) as LatestWASL
                passToNested = path.get(ogSrc, urlOrObject, true)
            }
            
            // Direct + Fallback for Relative Paths
            if (!node.src) {
                if (filesystem) {
                    const res = checkFiles(fullPath, filesystem)
                    if (res) {
                        if (res.default || fullPath.includes('.json')) node.src = passToNested = res
                        else if (typeof res === 'function')  node.src = passToNested = {default: res}
                        else {
                            onError({
                                type: 'warning',
                                message: `Node (${name}) at ${fullPath} does not have a default export.`,
                                file: ogSrc
                            })
                            delete o.graph.nodes[name]
                        }
                    }
                    else remove(ogSrc, fullPath, name, o.graph.nodes)

                } else {
                    onError({
                        message: 'No options.filesystem field to get JavaScript objects',
                        file: ogSrc
                    })
                }
            } 
            
            // drill into nested graphs
            if (node.src && typeof (node.src.default ?? node.src) !== 'function') node.src = await load(passToNested, {
                relativeTo: (relativePathMode) ? relativeToResolved : ogSrc,
                filesystem,
                errors,
                warnings,
                _internal: true
            }) 

        } else {

            if (node.src) {

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
                        })
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
                    })
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
                        })
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
            })
        }
    }
        }
    }

    if ('graph' in o) {

        for (let name in o.graph.nodes){
            const node = o.graph.nodes[name]

            // MULTIPURPOSE: Merge and validate components
            if 
            (
                node.src && 
                typeof node.src === 'object' // Successfully loaded
            ) {

                // Check if stateless
                if (node.src.default){
                    const fnString = node.src.default.toString()
                    const keyword = 'function'
                    if (fnString.slice(0, keyword.length) === keyword){
                        onError({
                            type: 'warning',
                            message: `Default export may be stateful.`,
                            node: name
                        })
                    }
                }

                // Merge node.components info with the actual node (i.e. instance) information
                if (node.src.graph) {
                    if (node.components) {
                        for (let nestedName in node.components){
                            const nestedNode = node.src.graph.nodes[nestedName]
                            if (nestedNode) {
                                for (let key in node.components[nestedName]){
                                    nestedNode[key] = Object.assign(nestedNode[key] ?? {}, node.components[nestedName][key])
                                }
                            } else {
                                onError({
                                    message: `Component target '${nestedName}' does not exist`,
                                    node: name
                                })
                            }
                        }
                    }


                } else {

                    // VALIDATE: Source files must have a default export
                    if (!('default' in node.src)){
                        onError({
                            message: 'No default export.',
                            node: name
                        })
                    }
                }


            }
        }

        // VALIDATE: Check that all edges point to valid nodes
        for (let output in o.graph.edges){
            if (!o.graph.nodes[output]) {
                onError({
                    message: `Node '${output}' does not exist to create an edge.`,
                    file: urlOrObject,
                })
            }

            for (let input in o.graph.edges[output]){
                if (!o.graph.nodes[input]) {
                    onError({
                        message: `Node '${input}' does not exist to create an edge.`,
                        file: urlOrObject,
                    })
                }
            }
        }
    }

    return o
}

}


export default load