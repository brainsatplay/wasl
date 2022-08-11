const fullSuffix = (fileName='') => (fileName).split('.').slice(1)

export const suffix = (fileName='') => {
    const suffix = fullSuffix(fileName) // Allow no name
    return suffix.join('.')
}

export const get = (path, rel = '') => {

    rel = rel.split('/').filter(v => v != '..').join('/') // Remove leading ..

    if (rel[rel.length - 1] === '/') rel = rel.slice(0, -1) // Remove trailing slashes

    let dirTokens = rel.split('/')
    if (dirTokens.length === 1 && dirTokens[0] === '') dirTokens = [] // Remove consequence of empty string rel

    const potentialFile = dirTokens.pop() // remove file name
    if (potentialFile) {
        const splitPath = potentialFile.split('.')
       if (splitPath.length == 1 || (splitPath.length > 1 && splitPath.includes(''))) dirTokens.push(potentialFile) // ASSUMPTION: All files have an extension
    }

    const pathTokens = path.split("/").filter(str => !!str) // remove bookend slashes

    const extensionTokens = pathTokens.filter((str, i) => {
        if (str === '..') {
            dirTokens.pop() // Pop off directories
            return false
        } else if (str === '.') return false
        else return true
    })

    const newPath = [...dirTokens, ...extensionTokens].join('/')

    return newPath
}