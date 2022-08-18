import * as path from './utils/path'

const cache = {}

// ESM File Importer with Cache Support
const get = async (relPath, relativeTo="") => {

    let type = path.suffix(relPath)
    const isJSON = (!type || type.includes('json'))

    // Correct paths for the different locations in the filesystem
    const fullPath = path.get(relPath, relativeTo)

    if (!cache[fullPath]){
        cache[fullPath] = ((isJSON) ? import(fullPath, {assert: {type: 'json'}}) : import(fullPath)).catch(async e => {
            if (e.message.includes('Failed to fetch')) {
                console.warn(`Trying to fetch ${fullPath} as text rather than using import()`)
                const tryAgain = await fetch(fullPath)
                if (tryAgain) {
                    if (isJSON) return {default: await tryAgain.json()}
                    else return {
                        text: await tryAgain.text()
                    }
                } else throw new Error('404')
            }
            else console.error(`Error loading ${relPath}`, e, e.name)
        })

        const res = await cache[fullPath]

        if (isJSON) cache[fullPath] = res?.default ?? {}
        else cache[fullPath] = res
    }

    return (isJSON) ? JSON.parse(JSON.stringify(cache[fullPath])) : cache[fullPath]
}

export default get