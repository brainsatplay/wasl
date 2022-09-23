import * as path from './utils/path'
import * as remoteImport from 'remote-esm'
import { Options } from './types'

const cache = {}
// ESM File Importer with Cache Support
const get = async (relPath, relativeTo="", onImport?, options:Options={}) => {

    let type = path.suffix(relPath)
    const isJSON = (!type || type.includes('json'))

    // Correct paths for the different locations in the filesystem
    const fullPath = (relPath[0] === '.') ? remoteImport.resolve(relPath, relativeTo) : relPath // Use Relative vs Absolute Path
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
            progress: options.callbacks?.progress?.fetch,
            outputText: true,
            filesystem: options.filesystem,
            nodeModules: options.nodeModules,
            rootRelativeTo: options.relativeTo,
            forceImportFromText: true
        }).catch(e => {
            throw e
        })

        cache[fullPath].imported = imported

        const res = await cache[fullPath]

        if (isJSON) cache[fullPath] = res?.default ?? {}
        else cache[fullPath] = res
    } else if (isFunc) imported.forEach(args => onImport(...args))

    return (isJSON) ? JSON.parse(JSON.stringify(cache[fullPath])) : cache[fullPath]
}

export default get