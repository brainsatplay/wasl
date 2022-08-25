import main from '../../phaser/index.wasl.json' assert {type: "json"}
import phaserInfo from '../../phaser/src/index.wasl.json' assert {type: "json"}

import mainPkg from '../../phaser/package.json'  assert {type: "json"}
import phaserPkg from '../../phaser/src/package.json'  assert {type: "json"}
import * as game from  '../../phaser/src/plugins/game/index.js'
import * as cursors from  '../../phaser/src/plugins/cursors/index.js'
import * as player from  '../../phaser/src/plugins/player/index.js'

import * as create from  '../../phaser/scripts/create.js'
import * as createPlayer from  '../../phaser/scripts/player/create.js'
import * as updatePlayer from  '../../phaser/scripts/player/update.js'

const path = '../../phaser/index.wasl.json'

const options = {
    relativeTo: import.meta.url,
    filesystem: {
        'package.json': mainPkg,
        'src/package.json': phaserPkg,
        'src/index.wasl.json': phaserInfo,
        'src/plugins/game/index.js': game,
        'src/plugins/player/index.js': player,
        'src/plugins/cursors/index.js': cursors,
        'scripts/create.js': create,
        'scripts/player/create.js': createPlayer,
        'scripts/player/update.js': updatePlayer,
    }
}

export {
    path,
    main,
    options
}