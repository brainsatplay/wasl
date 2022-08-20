// import * as wasl from "./dist/index.esm.js"
import * as wasl from "./src/index"

// import { path, main, options } from './demos/0.0.0.js'
// import { path, main, options } from './demos/starter.js'
// import { path, main, options } from './demos/phaser.js'
// import { path, main, options } from './demos/signals.js'
import { path, main, options } from './demos/remote.js'

const printError = (arr, type, severity='Error') => {
    arr.forEach(e => {
        const log = (severity === 'Warning') ? console.warn : console.error
        log(`${severity} (${type})`, e)
    })

}

const start = async () => {

    // Option #1: Import Mode
    console.log('------------------ IMPORT MODE ------------------')
    const importOptions = Object.assign({errors: [], warnings: [], files: {}}, options)
    const res = await wasl.validate(path, importOptions)
    console.log('wasl.validate (import)', res)
    if (res) {
            const o = await wasl.load(path, importOptions)
        console.log('wasl.load (import)', o)
    }

    printError(importOptions.errors, 'import')
    printError(importOptions.warnings, 'import', "Warning")

    // Option #2: Reference Mode (not possible for remote files in Node.js)
    if (main){
        console.log('------------------ REFERENCE MODE ------------------')
        const refOptions = Object.assign({errors: [], warnings: [], files: {}}, options)
        const resref = await wasl.validate(main, refOptions)
        console.log('wasl.validate (reference)', resref)
        if (resref) {
            const oref = await wasl.load(main, refOptions)
            console.log('wasl.load (reference)', oref)
        }
        printError(refOptions.errors, 'reference')
        printError(refOptions.warnings, 'reference', 'Warning')
    }
} 


start()