import * as wasl from "./src/index.js"

import { path, main, options } from './demos/0.0.0.js'
// import { path, main, options } from './demos/starter.js'
// import { path, main, options } from './demos/phaser.js'
// import { path, main, options } from './demos/signals.js'

const printErrors = (arr, type) => {
    arr.forEach(e => {
        console.log(`Error (${type})`, e)
    })

}

const start = async () => {

    // Option #1: Import Mode
    console.log('------------------ IMPORT MODE ------------------')
    const importOptions = Object.assign({errors: []}, options)
    const res = await wasl.validate(path, importOptions)
    console.log('wasl.validate (import)', res)
    if (res) {
        const o = await wasl.load(path, importOptions)
        console.log('wasl.load (import)', o)
    }

    printErrors(importOptions.errors, 'import')

    // Option #2: Direct Mode
    console.log('------------------ DIRECT MODE ------------------')
    const directOptions = Object.assign({errors: []}, options)
    const resDirect = await wasl.validate(main, directOptions)
    console.log('wasl.validate (direct)', resDirect)
    if (resDirect) {
        const oDirect = await wasl.load(main, directOptions)
        console.log('wasl.load (direct)', oDirect)
    }
    printErrors(directOptions.errors, 'direct')
} 


start()