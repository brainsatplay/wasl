// import * as wasl from "./dist/index.esm.js"
import wasl from "./src/wasl-core/index"
import validate from "./src/wasl-validate/index"

// import { path, main, options } from './demos/0.0.0.js'
// import { path, main, options } from './demos/starter.js'
// import { path, main, options } from './demos/phaser.js'
import { path, main, options } from './demos/signals.js'
// import { path, main, options } from './demos/remote.js'

const printError = (arr, type, severity='Error') => {
    arr.forEach(e => {
        const log = (severity === 'Warning') ? console.warn : console.error
        log(`${severity} (${type})`, e)
    })

}

const startExecution = async () => {

    options.activate = true // use internal graph system
    options.parentNode = document.getElementById('container') // set parent node

    // Option #1: Import Mode
    console.log('------------------ IMPORT MODE ------------------')
    const importOptions = Object.assign({errors: [], warnings: [], files: {}}, options)
    const res = await validate(path, importOptions)
    console.log('validate (import)', res)
    if (res) {
        const o = await wasl(path, importOptions)
        console.log('load (import)', o)
    }

    printError(importOptions.errors, 'import')
    printError(importOptions.warnings, 'import', "Warning")

    // Option #2: Reference Mode (not possible for remote files in Node.js)
    if (main){
        console.log('------------------ REFERENCE MODE ------------------')
        const refOptions = Object.assign({errors: [], warnings: [], files: {}}, options)
        const res = await validate(main, refOptions)
        console.log('validate (reference)', res)
        if (res) {
            const o = await wasl(main, refOptions)
            console.log('load (reference)', o)
        }
        printError(refOptions.errors, 'reference')
        printError(refOptions.warnings, 'reference', 'Warning')
    }
} 


startExecution()