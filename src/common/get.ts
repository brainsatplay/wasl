import * as path from './utils/path'
import * as remoteImport from 'remote-esm'

const cache = {}
// ESM File Importer with Cache Support
const get = async (relPath, relativeTo="", onImport?) => {

    let type = path.suffix(relPath)
    const isJSON = (!type || type.includes('json'))

    // Correct paths for the different locations in the filesystem
    const fullPath = remoteImport.resolve(relPath, relativeTo)
    const isFunc = typeof onImport === 'function'
    const imported = cache[fullPath]?.imported ?? []

    if (!cache[fullPath]){

        const imported = []
        cache[fullPath] = remoteImport.default(fullPath, {
            onImport: (...args) => {                
                if (isFunc) {
                    imported.push(args)
                    onImport(...args)
                }
            }, 
            outputText: true
        }).catch(e => {
            if (e.message.includes("Failed to fetch")) throw new Error("404");
            else throw e
        })

        cache[fullPath].imported = imported

        const res = await cache[fullPath]

        if (isJSON) cache[fullPath] = res?.default ?? {}
        else cache[fullPath] = res
    } else if (isFunc) imported.forEach(args => onImport(...args))

    return (isJSON) ? JSON.parse(JSON.stringify(cache[fullPath])) : cache[fullPath]
}

export default get