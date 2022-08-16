import { Options } from "../types/index"

const valid = (input, options, location): Options['errors'] => {
    
    const errors = []
    const isUndefined = options?.relativeTo === undefined
    const isString = typeof input === 'string'
    const isObject = typeof input === 'object'

    let error;
    if (isString) {
        if (!((!isUndefined && 'relativeTo' in options))){
        
            if (import.meta.url) {
                error = {message: 'Not a valid relativeTo key (required) in options', file: input}
                console.warn(`[wasl-${location}] Import Mode Error: Please pass a valid string to options.relativeTo (ideally import.meta.url).`)
            } else {
                error = {message: 'import.meta.url is not supported', file: input}
                console.warn(`[wasl-${location}] Import Mode Error: import.meta.url is not available. Does your bundler support it?`)
            }
            
        }

    } else if (!isObject) {
        error = {message: 'Not a valid object passed in the first argument', file: null}
        console.warn(`[wasl-${location}] Direct Mode Error: Please pass a valid object in the first argument and pass file object references via the options.filesystem field.`)
    } 
    

    if (error) {
        error.function = location
        errors.push(error)
    }

    return errors
}

export {
    valid
}