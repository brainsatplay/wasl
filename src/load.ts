import { LatestWASL, Options } from "./types"
import * as languages from './utils/languages'
import * as path from './utils/path'
import get from './get'

// Options: 
//     - Provide a url and a options.relativeTo entry (locally served + Node.js only)
//     - Provide a file object and options.nested entry (any)

const checkFiles = (key, filesystem) => {
    const isJSON = path.suffix(key).slice(-4) === "json" ? true : false;
    const output = isJSON && filesystem[key] ? JSON.parse(JSON.stringify(filesystem[key])) : filesystem[key]; 
    return output;
}

var remove = (original, search=original, key=original, o?)=> {
    console.error(`Source was not ${original ? `resolved for ${original}` : `specified for ${key}`}. ${search ? `If available, refer to this object directly as options.nested["${search}"]. ` : ''}${o ? `Automatically removing ${key} from the WASL file.` : ''}`);
    if (o) delete o[key];
  }

const load = async (
    urlOrObject: string | LatestWASL, 
    options: Options = {}
) => {
    let { relativeTo, filesystem } = options

    const relativePathMode = typeof urlOrObject === 'string' && relativeTo

    let pkg, o = Object.assign({}, urlOrObject) as any; // shallow copy to split references but keep functions
    const basePkgPath = 'package.json'
    if (relativePathMode) {
        pkg = await get(path.get(basePkgPath, urlOrObject), relativeTo) as any
        o = Object.assign(pkg, await get(urlOrObject, relativeTo) as LatestWASL) as any
    } else if (filesystem) {
        const pkgPath = path.get(basePkgPath, relativeTo)
        pkg = checkFiles(pkgPath, filesystem)
        if (pkg) o = Object.assign(pkg, o) as any
        else remove(basePkgPath, pkgPath)
    }
    else {
        if (relativeTo){
            pkg = await get(basePkgPath, relativeTo) as any
            if (pkg) o = Object.assign(pkg, o) as any
        }
    }

    // replace src with actual source text
    const nodes = o.graph.nodes
    for (let name in nodes) {
        const node = nodes[name]
        const ogSrc = node.src  ?? '';
        if (typeof ogSrc === 'string'){

            node.src = null
            // Option #1: Active ESM source (TODO: Fetch text for ambiguous interpretation, i.e. other languages)
            let passToNested = null
            let fullPath = (relativePathMode) ? path.get(ogSrc, urlOrObject) : path.get(ogSrc, options.relativeTo)
            
            // Use Relative Paths
            if (relativePathMode) {
                node.src = await get(fullPath, relativeTo) as LatestWASL
                passToNested = fullPath
            }
            
            // Direct + Fallback for Relative Paths
            if (!node.src) {
                if (filesystem) {
                    const res = checkFiles(fullPath, filesystem)
                    if (res) node.src = passToNested = res
                    else remove(ogSrc, fullPath, name, o.graph.nodes)

                } else console.warn('No nested files to get JavaScript objects from...', ogSrc)
            } 
            
            // drill into nested graphs
            if (node.src && typeof (node.src.default ?? node.src) !== 'function') node.src = await load(passToNested, {
                relativeTo: (relativePathMode) ? relativeTo : ogSrc,
                filesystem,
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
                        if (imported.default && Object.keys(imported).length === 1) imported = imported.default
                        return imported
                    } catch (e) {
                        console.error(e)
                    }
                }
                
                const esm = await esmImport(node.src.text)
                if (esm) {
                    delete node.src.text
                    node.src = Object.assign(node.src, esm)
                } else console.warn('could not import this text as ESM')
            } 

            // Option #3: Activate JS functions in JSON object
            else {

                const expectedFunctions = ['default', 'oncreate', 'onrender']
                for (let key in node.src){
                    try {
                        if (expectedFunctions.includes(key) && typeof node.src[key] === 'string') node.src[key] = (0, eval)(`(${node.src[key]})`)
                    } catch (e) {
                        console.warn(`Field ${key} could not be parsed for`, node.src[key]);
                    }
                }
            }  
        }

        // Option #4: Allow downstream application to parse non-JS text
        else {
            console.warn(`Text is in ${language}, not JavaScript. This is not currently parsable automatically.`);
        }
    }
        }
    }

    return o
}


export default load