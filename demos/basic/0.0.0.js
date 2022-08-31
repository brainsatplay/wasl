// Manually load all plugins with the correct keys
import main from '../../tests/0/0.0/0.0.0/basic/index.wasl.json' assert {type: "json"}
import pkg from '../../tests/0/0.0/0.0.0/basic/package.json' assert {type: "json"}
import pluginPkg from '../../tests/0/plugins/plugin/package.json' assert {type: "json"}
import plugin from '../../tests/0/plugins/plugin/index.wasl.json' assert {type: "json"}
import math from '../../tests/0/plugins/plugin/index.wasl.json' assert {type: "json"}
import * as log from "../../tests/0/plugins/log.js"
import * as add from "../../tests/0/plugins/math/add.js"
import * as add2 from "../../tests/0/plugins/math/add2.js"
import * as multiply from "../../tests/0/plugins/math/multiply.js"
import * as multiply2 from "../../tests/0/plugins/math/multiply2.js"

import number from '../../tests/0/0.0/0.0.0/basic/number.js'

const path = '../../tests/0/0.0/0.0.0/basic/index.wasl.json'
const filesystem = {
    ['package.json']: pkg,
    ['plugins/plugin/index.wasl.json']: plugin,
    ["plugins/log.js"]: log,
    ['plugins/math/index.wasl.json']: math,
    ["plugins/math/add.js"]: add,
    ["plugins/math/add2.js"]: add2,
    ["plugins/math/multiply.js"]: multiply,
    ["plugins/math/multiply2.js"]: multiply2,
    ['plugins/plugin/package.json']: pluginPkg,
    ['number.js']: number
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