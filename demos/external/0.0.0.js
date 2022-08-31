// Manually load all plugins with the correct keys
import main from '../../tests/0/0.0/0.0.0/external/index.wasl.json' assert {type: "json"}
import pkg from '../../tests/0/0.0/0.0.0/external/package.json' assert {type: "json"}

const path = '../../tests/0/0.0/0.0.0/external/index.wasl.json'
const filesystem = {
    ['package.json']: pkg
}

// Specify options
const options = {
    relativeTo: import.meta.url,
    version: '0.0.0',
    filesystem
}


export {
    path,
    main,
    options
}