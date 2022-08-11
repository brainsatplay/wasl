import * as path from './utils/path'

const cache = {}

// ESM File Importer with Cache Support
const get = async (relPath, relativeTo) => {

    let type = path.suffix(relPath)
    const isJSON = (!type || type.includes('json'))

    // Correct paths for the different locations in the filesystem
    const fullPath = path.get(relPath, relativeTo)

    if (!cache[fullPath]){
        cache[fullPath] = (isJSON) ? import(fullPath, {assert: {type: 'json'}}) : import(fullPath)
        const importPromise = (isJSON) ? import(fullPath, {assert: {type: 'json'}}) : import(fullPath)
        const res = await importPromise.catch(e => {
            console.error(`Error loading ${relPath}`,fullPath, e)
        })

        if (isJSON) cache[fullPath] = res.default
        else cache[fullPath] = res
    }
    return (isJSON) ? JSON.parse(JSON.stringify(cache[fullPath])) : cache[fullPath]
}

export default get