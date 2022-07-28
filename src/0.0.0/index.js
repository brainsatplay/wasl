import * as log from './log.js' // simple plugin
import * as plugin from './plugin/index.js' // complex plugin

// Exports Define Exposed "Ports" on your Plugin
export default {
    log,
    plugin
}