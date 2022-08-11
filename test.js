import * as wasl from "./dist/index.esm.js"
import { getTest } from "./src/utils/get.js"
import version from "./src/utils/latest.js"

const path = './tests/0/0.0/0.0.0/index.wasl.json'

// Manually load all plugins with the correct keys
import main from './tests/0/0.0/0.0.0/index.wasl.json' assert {type: "json"}
import pkg from './tests/0/0.0/0.0.0/package.json' assert {type: "json"}
import pluginPkg from './tests/0/plugins/plugin/package.json' assert {type: "json"}
import plugin from './tests/0/plugins/plugin/index.wasl.json' assert {type: "json"}
import * as log from "./tests/0/plugins/log.js"
import * as add from "./tests/0/plugins/add.js"
import multiply from "./tests/0/plugins/multiply.js"

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
    version: version,
    filesystem
}

// Option #1: Import Mode
console.log('------------------ IMPORT MODE ------------------')
const res = await wasl.validate(path, options)
console.log('wasl.validate (import)', res)
const o = await wasl.load(path, options)
console.log('wasl.load (import)', o)

// Option #2: Direct Mode
console.log('------------------ DIRECT MODE ------------------')
const optionsDirect ={
    version: version,
    filesystem
}
const resDirect = await wasl.validate(main, optionsDirect)
console.log('wasl.validate (direct)', resDirect)
const oDirect = await wasl.load(main, optionsDirect)
console.log('wasl.load (direct)', oDirect)
