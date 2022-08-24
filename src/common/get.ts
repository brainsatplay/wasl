import * as path from './utils/path'
import * as remoteImport from 'remote-esm'

const cache = {}
// ESM File Importer with Cache Support
const get = async (relPath, relativeTo="", onImport?) => {

    let type = path.suffix(relPath)
    const isJSON = (!type || type.includes('json'))

    // Correct paths for the different locations in the filesystem
    const fullPath = remoteImport.resolve(relPath, relativeTo)

    if (!cache[fullPath]){

        cache[fullPath] = remoteImport.default(fullPath, {onImport}).catch(e => {
            if (e.message.includes("Failed to fetch")) throw new Error("404");
            else throw e
        })

        const res = await cache[fullPath]

        if (isJSON) cache[fullPath] = res?.default ?? {}
        else cache[fullPath] = res
    }

    return (isJSON) ? JSON.parse(JSON.stringify(cache[fullPath])) : cache[fullPath]
}

export default get