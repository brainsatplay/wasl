import { getSchema } from "../utils/get.js"
import Ajv from "ajv"
import addFormats from "ajv-formats"
import version from "../utils/latest.js"

const ajv = new Ajv()
addFormats(ajv)

// Validate the data against the registered JSON Schema schema for WASL
export const validate = async (data, v=version) => {
    let schema = await getSchema(v)
    const schemaCopy = JSON.parse(JSON.stringify(schema))
    const keysWithDollarSign = Object.keys(schemaCopy).filter(k => k.includes('$'))
    keysWithDollarSign.forEach(k => delete schemaCopy[k])

    const validate = ajv.compile(schemaCopy)
    const valid = validate(data)
    

    // Log the status of the validation
    if (valid) console.log(`Data matches the schema for wasl v${v}`) 
    else console.error(validate.errors) 

    // Check whether the src references are actually available
    console.warn('TODO: Validate the existence of the src files') 
    
}
