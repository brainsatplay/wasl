import { getSchemas } from "./utils/get.js"
import Ajv from "ajv"
import addFormats from "ajv-formats"
import latest from "./utils/latest.js"
import { LatestWASL, Options } from "./types/index.js"
import get from "./get.js"

let activeVersion = null
const ajv = new Ajv({allErrors: true})
addFormats(ajv)

// Validate the data against the registered JSON Schema schema for WASL
// Options: 
//     - Provide a url and a options.relativeTo entry (locally served + Node.js only)
//     - Provide a file object (any)

const validate = async (urlOrObject, options:Options={}) => {
    let {version, relativeTo} = options
    if (!version) version = latest

    let data = urlOrObject
    if (typeof data === 'string') data = await get(urlOrObject, relativeTo) as LatestWASL
    activeVersion = version
    let schemas = await getSchemas(version)
    const schemaCopy = JSON.parse(JSON.stringify(schemas.main))

    schemas.other.forEach(s => {
        const schema = ajv.getSchema(s.name)
        if (!schema) ajv.addSchema(s.ref, s.name)
    })

    // Load schema noted with a $ref key
    const validate = await ajv.compile(schemaCopy)
    const valid = validate(data)

    return valid || validate.errors
}

export default validate
