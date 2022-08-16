// Manually load all plugins with the correct keys
import main from '../tests/0/0.0/0.0.0/index.wasl.json' assert {type: "json"}
import pkg from '../tests/0/0.0/0.0.0/package.json' assert {type: "json"}
import pluginPkg from '../tests/0/plugins/plugin/package.json' assert {type: "json"}
import plugin from '../tests/0/plugins/plugin/index.wasl.json' assert {type: "json"}
import * as log from "../tests/0/plugins/log.js"
import * as add from "../tests/0/plugins/add.js"
import multiply from "../tests/0/plugins/multiply.js"

const path = '../tests/0/0.0/0.0.0/index.wasl.json'
const filesystem = {
    ['package.json']: pkg,
    ['plugins/plugin/index.wasl.json']: plugin,
    ["plugins/log.js"]: log,
    ["plugins/add.js"]: add,
    ["plugins/multiply.js"]: multiply,
    ['plugins/plugin/package.json']: pluginPkg,
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