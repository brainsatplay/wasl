import { getSchemas } from "./utils/get.js"
import Ajv from "ajv"
import addFormats from "ajv-formats"
import latest from "./utils/latest.js"
import { LatestWASL, Options } from "./types/index.js"
import get from "./get.js"
import * as check from './utils/check'
import load from "./load.js"

let activeVersion = null
const ajv = new Ajv({
    allErrors: true,
    // strictRequired: false //"log"
})
addFormats(ajv)

// Validate the data against the registered JSON Schema schema for WASL
// Options: 
//     - Provide a url and a options.relativeTo entry (locally served + Node.js only)
//     - Provide a file object (any)

const validate = async (urlOrObject, options:Options={}) => {
    const clone = Object.assign({errors: []}, options)
    let {version, relativeTo} = clone
    if (!version) version = latest

    let valid = true;
    let data = urlOrObject

    // Check Input
    const inputErrors = check.valid(urlOrObject, options, 'validate')
    const inputIsValid = inputErrors.length === 0
    clone.errors.push(...inputErrors)

    // Check First Path
    if (typeof urlOrObject === 'string')  data = await get(urlOrObject, relativeTo).catch(e => clone.errors.push({ 
        message: e.message,
        file: urlOrObject
    })) as LatestWASL

    // Schema Validation
    if (clone.errors.length === 0) {

        activeVersion = version
        let schemas = await getSchemas(version)
        const schemaCopy = JSON.parse(JSON.stringify(schemas.main))

        schemas.all.forEach(s => {
            const schema = ajv.getSchema(s.name)
            if (!schema) ajv.addSchema(s.ref, s.name)
        })
        const validate = await ajv.compile(schemaCopy)
        valid = validate(data)
        if (validate.errors) clone.errors.push(...validate.errors)

    }

    // Runtime Validation
    if (inputIsValid && !clone._internal){
        const loaded = await load(data, clone)
        clone._internal = true
        valid = await validate(loaded, clone)
    }

    return valid

}

export default validate
