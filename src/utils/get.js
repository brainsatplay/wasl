import version from "./latest.js"
import registry from "./registry.js"

const schemaCache = {}
export const getSchema = async (v=version) => {
    // const path = getSchemaPath(v, name)

    if (!schemaCache[v]) {
        schemaCache[v] = {}
        const og = registry[v]
        if (!og) {
            console.error('Schema not properly linked in the wasl library', v, name)
        }
        for (let schema in og) {
            // const og = (await import(path, {assert: {type: "json"}})).default
            const keysWithDollarSign = Object.keys(og[schema]).filter(k => k.includes('$'))
            keysWithDollarSign.forEach(k => delete og[schema][k])
        }

        schemaCache[v] = og
    }
    
    return schemaCache[v]
}

export const getSchemas = async (v=version, name="plugin.schema.json") => {
    const o = {main: null, other: []}
    const schemas = await getSchema(v)
    const keys = Object.keys(schemas)
    o.main = schemas[name]

    keys.forEach(k => {
        if (k !== name) {
            o.other.push({ref: schemas[k], name: k})
  
        }
    })

    return o
}

export const getBasePath = (path) => {
    return path //.split('/').slice(-1)[0]
    .split('.').slice(0, -1).join('.')
}

export const getSchemaPath = (v=version, name="plugin.schema.json") => {
    return `../../versions/${v}/${name}`
}

export const getTestPath = async (v=version) => {
    const delimiter = '.'
    const versionLocationString = v.split('.').reduce((a,b) => {
    const prev = a[a.length - 1]
    a.push(prev ? `${prev}${delimiter}${b}` : b)
    return a
    }, []).join('/')

    return `../../tests/${versionLocationString}/index.wasl.json`
}

export const getTest = async (v=version) => {
    const path = await getTestPath(v)
    return (await import(path, {assert: {type: "json"}})).default
}