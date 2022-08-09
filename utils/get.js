import version from "./latest.js"

const schemaCache = {}
export const getSchema = async (v=version) => {
    const path = getSchemaPath(v)
    if (!schemaCache[path]) schemaCache[path] = (await import(getSchemaPath(v), {assert: {type: "json"}})).default
    return schemaCache[path]
}

export const getBasePath = (path) => {
    return path //.split('/').slice(-1)[0]
    .split('.').slice(0, -1).join('.')
}

export const getSchemaPath = (v=version) => {
    return `../versions/${v}/plugin.schema.json`
}

export const getTestData = async (v=version) => {
    const delimiter = '.'
    const versionLocationString = v.split('.').reduce((a,b) => {
    const prev = a[a.length - 1]
    a.push(prev ? `${prev}${delimiter}${b}` : b)
    return a
    }, []).join('/')

    return (await import(`../tests/${versionLocationString}/index.wasl.json`, {assert: {type: "json"}})).default
}