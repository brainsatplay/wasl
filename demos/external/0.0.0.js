// Manually load all plugins with the correct keys
import main from '../../tests/0/0.0/0.0.0/external/index.wasl.json' assert {type: "json"}
import pkg from '../../tests/0/0.0/0.0.0/external/package.json' assert {type: "json"}
import * as log from "../../tests/0/plugins/log.js"
import * as threshold from '../../tests/0/plugins/threshold.js'
import * as average from '../../tests/0/plugins/average.js'

const path = 'tests/0/0.0/0.0.0/external/index.wasl.json'
const filesystem = {
    ['package.json']: pkg,
    ["plugins/log.js"]: log,
    ["plugins/threshold.js"]: threshold,
    ["plugins/average.js"]: average,
}

// Specify options
const options = {
    version: '0.0.0',
    filesystem
}


export {
    path,
    main,
    options
}