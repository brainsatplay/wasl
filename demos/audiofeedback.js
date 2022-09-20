import main from '../../graphscript/examples/audiofeedback/index.wasl.json' assert {type: "json"}

import mainPkg from '../../graphscript/examples/audiofeedback/package.json'  assert {type: "json"}
import statsStart from '../../graphscript/examples/audiofeedback/src/plugins/output/stats/start.js'
import * as statsReset from  '../../graphscript/examples/audiofeedback/src/plugins/output/stats/reset'
import * as waveform from  '../../graphscript/examples/audiofeedback/src/plugins/output/waveform.js'
import * as csvMenu from  '../../graphscript/examples/audiofeedback/src/plugins/output/csv/menu.js'
import * as soundStop from  '../../graphscript/examples/audiofeedback/src/plugins/output/sound/stop.js'
import * as soundPlay from  '../../graphscript/examples/audiofeedback/src/plugins/output/sound/play.js'
import * as soundDropdown from  '../../graphscript/examples/audiofeedback/src/plugins/output/sound/dropdown.js'
import * as soundHeader from  '../../graphscript/examples/audiofeedback/src/plugins/output/sound/header.js'
import * as connectDevice from  '../../graphscript/examples/audiofeedback/src/plugins/connect/device.js'
import * as selectBLE from  '../../graphscript/examples/audiofeedback/src/plugins/select/ble.js'
import * as selectUSB from  '../../graphscript/examples/audiofeedback/src/plugins/select/usb.js'
import * as connectMode from  '../../graphscript/examples/audiofeedback/src/plugins/connect/mode.js'
import * as connectHeader from  '../../graphscript/examples/audiofeedback/src/plugins/connect/header.js'

const path = ''

const options = {
    filesystem: {
        'package.json': mainPkg,
        'src/plugins/output/stats/start.js': statsStart,
        'src/plugins/output/stats/reset.js': statsReset,
        'src/plugins/output/waveform.js': waveform,
        'src/plugins/output/csv/menu.js': csvMenu,
        'src/plugins/output/sound/stop.js': soundStop,
        'src/plugins/output/sound/play.js': soundPlay,

        'src/plugins/output/sound/dropdown.js': soundDropdown,
        'src/plugins/output/sound/header.js': soundHeader,
        'src/plugins/connect/device.js': connectDevice,
        'src/plugins/select/ble.js': selectBLE,
        'src/plugins/select/usb.js': selectUSB,
        'src/plugins/connect/mode.js': connectMode,
        'src/plugins/connect/header.js': connectHeader,
    }
}

export {
    path,
    main,
    options
}