import * as wasl from "./src/index"

// import { path, main, options } from './demos/0.0.0.js'
// import { path, main, options } from './demos/starter.js'
import { path, main, options } from './demos/phaser.js'
// import { path, main, options } from './demos/signals.js'

const start = async () => {

    // Option #1: Import Mode
    console.log('------------------ IMPORT MODE ------------------')
    const res = await wasl.validate(path, options)
    console.log('wasl.validate (import)', res)
    const o = await wasl.load(path, options)
    console.log('wasl.load (import)', o)

    // Option #2: Direct Mode
    console.log('------------------ DIRECT MODE ------------------')
    const resDirect = await wasl.validate(main, options)
    console.log('wasl.validate (direct)', resDirect)
    const oDirect = await wasl.load(main, options)
    console.log('wasl.load (direct)', oDirect)
}

start()