// import * as wasl from "./dist/index.esm.js"
import wasl from "./src/core/index"
import validate from "./src/validate/index"

// import { path, main, options } from './demos/basic/0.0.0.js'
// import { path, main, options } from './demos/external/0.0.0.js'
// import { path, main, options } from './demos/starter.js'
// import { path, main, options } from './demos/remote.js'
import { path, main, options } from './demos/signals.js'
// import { path, main, options } from './demos/phaser.js'

// Broken

const printError = (arr, type, severity='Error') => {
    arr.forEach(e => {
        const log = (severity === 'Warning') ? console.warn : console.error
        log(`${severity} (${type})`, e)
    })
}

const referenceDiv = document.getElementById('reference') 
const importDiv = document.getElementById('import')

const startExecution = async () => {

    options.activate = true // use internal graph system
    options.wasl = wasl
    // options.output = 'object'
    options.debug = true

    let ref, imported

    // Option #1: Import Mode
    const importOptions = Object.assign({errors: [], warnings: []}, options)
    importOptions.parentNode = document.getElementById('importcontainer') // set parent node

    const res = await validate(path, importOptions)
    console.log('validate (import)', res)
    

    if (res) {
        imported = new wasl(path, importOptions)
        console.log('load (import)', imported)
        importOptions.errors = imported.errors
        importOptions.warnings = imported.warnings
    }

    printError(importOptions.errors, 'import')
    printError(importOptions.warnings, 'import', "Warning")

    // Option #2: Reference Mode (not possible for remote files in Node.js)
    if (main){
        const refOptions = Object.assign({errors: [], warnings: []}, options)
        refOptions.parentNode = document.getElementById('refcontainer') // set parent node
        const res = await validate(main, refOptions)
        console.log('validate (reference)', res)
        if (res) {
            ref = new wasl(main, refOptions)
            console.log('load (reference)', ref)
            refOptions.errors = ref.errors
            refOptions.warnings = ref.warnings
        }
        printError(refOptions.errors, 'reference')
        printError(refOptions.warnings, 'reference', 'Warning')
    }


    let info = [
        {wasl: imported, div: importDiv,  name: "Import"}, 
        {wasl: ref, div: referenceDiv,  name: "Reference"}
    ]

    let strArr = []
    let refArr = []
    let flowArr = []
    let resArr = []

    for (let i in info){
        let o = info[i]
        if (o.wasl) {
            console.log(`------------------ ${o.name.toUpperCase()} MODE ------------------`)
            await o.wasl.init()
            await o.wasl.start()
            const str = JSON.stringify(o.wasl.original, null, 2)
            o.div.value = str

            strArr.push(str)
            refArr.push(o.wasl.original)
            flowArr.push(o.wasl.flow)
            resArr.push(o.wasl.resolutions)

        } else o.div.value = undefined
    }

    if (refArr[0] && refArr[1]) console.warn('Same Original Input to ESPlugins', strArr[0] === strArr[1])
    else console.warn('One of the modes has failed for this example!')

} 


startExecution()