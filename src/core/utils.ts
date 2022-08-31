import * as path from '../common/utils/path'
import * as languages from '../common/utils/languages'

export const isSrc = (str) => {
    return typeof str === 'string' && Object.values(languages).find(arr => arr.includes(str.split('.').slice(-1)[0])) // Has supported extension
}

export const merge = (main, override, deleteSrc=false) => {

    const copy = Object.assign({}, main)
    if (override){
        if (deleteSrc) {
            const ogSrc = override.src ?? override
            delete override.src
            if ('default' in ogSrc) return ogSrc.default // default export
        }

        const keys = Object.keys(copy)
        const newKeys = new Set(Object.keys(override))

        keys.forEach(k => {
            newKeys.delete(k)
            if (typeof override[k] === 'object' && !Array.isArray(override[k])) copy[k] = merge(copy[k], override[k])
            else if (k in override) copy[k] = override[k] // replace values and arrays
        })

        newKeys.forEach(k => {
            copy[k] = override[k]
        })
    }
    
    return copy // named exports
}

export const checkFiles = (key, filesystem) => {
    const isJSON = path.suffix(key).slice(-4) === "json" ? true : false;
    const output = isJSON && filesystem[key] ? JSON.parse(JSON.stringify(filesystem[key])) : filesystem[key];
    return output;
}

export var remove = (original, search, key=original, o?)=> {
    console.error(`Source was not ${original ? `resolved for ${original}` : `specified for ${key}`}. ${search ? `If available, refer to this object directly as options.filesystem["${search}"]. ` : ''}${o ? `Automatically removing ${key} from the WASL file.` : ''}`);
    if (o) delete o[key];
  }
