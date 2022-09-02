import { LatestWASL, Options } from "../common/types"
import * as languages from '../common/utils/languages'
import get from '../common/get'
import * as check from '../common/utils/check'
import * as utils from './utils'

import * as remoteImport from 'remote-esm'
import ESPlugin from "es-plugins/dist/index.esm"

const basePkgPath = './package.json'

const startTime = Date.now()

class WASL {

    errors: any[] = []
    warnings: any[] = []
    files: { [x: string]: any } = {}
    plugin?: ESPlugin
    original?: { [x: string]: any } = {}
    debug: undefined | { [x: string]: any } = undefined


    #filesystem: Options['filesystem']


    #input = {}
    #options = {}
    #url = undefined
    #cache = {}
    #main = ''
    #mode = 'import'

    #onImport = (path, info) => this.files[path] = info

    #throw = (e) => {
        const item = {
            message: e.message,
            file: e.file,
            node: e.node,
        }

        const arr = (e.type === 'warning') ? this.warnings : this.errors
        arr.push(item)
    }

    constructor(
        urlOrObject: string | LatestWASL,
        options: Options = {},
        url?: string
    ) {

        this.#input = urlOrObject
        this.#options = options
        this.#url = url
    }

    get = async (...args) => {
        const path = args[0]

        return await get(args[0], args[1], this.#onImport).catch((e) => this.#throw({
            message: e.message,
            file: path
        }))
    }


    // Load the internal "plugins" field in a WASL file to the dependent node
    load = async (node, info, options, id?: any, symbols?, counter?) => {

        if (node.plugins) {
            for (let nestedName in node.plugins) {

                const nestedNode = node.src.graph?.nodes?.[nestedName]

                for (let key in node.plugins[nestedName]) {
                    const newInfo = node.plugins[nestedName][key]

                    if (typeof newInfo === 'object' && !Array.isArray(newInfo)) {

                        const ogSrc = newInfo.src
                        let newInfoForNode;
                        if (id) newInfoForNode = this.#cache[id]?.[key] // check cache

                        if (!newInfoForNode) {

                            // Properly merge the resolved src info
                            const optsCopy = Object.assign({}, options) as Options
                            if (key === 'graph') optsCopy._deleteSrc = false // keep all node imports
                            else optsCopy._deleteSrc = true

                            newInfoForNode = (await this.resolve({ [key]: newInfo }, info, optsCopy, {
                                nodes: newInfo
                            }, symbols, counter))

                            if (id) {
                                if (!this.#cache[id]) this.#cache[id] = {}
                                this.#cache[id][key] = newInfoForNode // cache
                            }
                        }

                        // Only With Node Resolved
                        if (nestedNode) {
                            const newVal = newInfoForNode[key]

                            if (newVal) {
                                let chosenVal = newVal.src ?? newVal
                                // merge default if the only key
                                if ('default' in chosenVal && Object.keys(chosenVal).length === 1) chosenVal = chosenVal.default
                                if (nestedNode) nestedNode[key] = chosenVal // MERGE BY REPLACEMENT
                            } else {
                                this.#throw({ message: `Could not resolve ${ogSrc}` })
                            }
                        }

                    } else if (nestedNode) nestedNode[key] = newInfo // MERGE BY REPLACEMENT
                }

                // Source is Resolved but Node is Not
                if (node.src.graph && !nestedNode) {
                    this.#throw({
                        message: `Plugin target '${nestedName}' does not exist`,
                        node: name
                    })
                }
            }
        }
    }

    // --------- Main WASL Resolution Function ---------
    // This method resolves all the src fields in the WASL file
    resolve = async (target, info, options, graph: any = {}, symbols: string[] = [], counter) => {
        const nodes = graph.nodes as any
        const edges = graph.edges as any

        counter++ // increment to show depth of resolution

        const id = Symbol('unique')

        let { url } = info

        const mainPath = info.mainPath || this.#main // use base main if not specified


        const symbolsRegistry = {}
        // const innerTopLevel = options._top === true


        for (let name in target) {

            let symbolsCopy = symbolsRegistry[name] = [...symbols]

            const node = target[name]
            const isObj = node && typeof node === 'object' && !Array.isArray(node)

            if (isObj) {
                await this.load(node, info, options, id, symbolsCopy, counter) // before loading make sure graph is not specified at a higher level
                let ogSrc = node.src ?? '';
                if (utils.isSrc(ogSrc) || (nodes && edges && !ogSrc)) {
                    node.src = null

                    // Option #1: Active ESM source (TODO: Fetch text for ambiguous interpretation, i.e. other languages)
                    let _internal: string | true = '' // don't mistake for user call
                    let _modeOverride = options._modeOverride;
                    let fullPath
                    try {
                        new URL(ogSrc);
                        _internal = fullPath = ogSrc
                        _modeOverride = 'import'
                    } catch {
                        if (ogSrc) fullPath = mainPath ? remoteImport.resolve(ogSrc, mainPath) : remoteImport.resolve(ogSrc);
                    }

                    let mode = options._modeOverride ?? this.#mode

                    // Only Get Source based on the value present (though mainPath will allow for relative resolutions)
                    if (ogSrc) {

                        if (this.debug){

                            // Get Flow
                            let target = this.debug.flow
                            symbolsCopy.forEach(str => {
                                if (str) {
                                    if (!target[str]) target[str] = {}
                                    target = target[str]
                                }
                            })
                            
                            // Count Resolutions
                            if (!this.debug.resolutions[name]) this.debug.resolutions[name] = {}
                            let nameRes = this.debug.resolutions[name]
                            if (!nameRes[fullPath]) nameRes[fullPath] = { _resolutions: 0, _depth: [], _time: [] }
                            nameRes[fullPath]._resolutions++
                            nameRes[fullPath]._depth.push(counter)
                            nameRes[fullPath]._time.push(Date.now() - startTime)

                            if (target) target[fullPath] = {}
                        }


                        //Import Mode
                        if (_internal || mode === 'import') {
                            let res = await this.get(fullPath, undefined) as LatestWASL
                            if (res) node.src = res
                            if (!node.src && !node.graph) utils.remove(ogSrc, fullPath, name, target) // remove if no source and no graph
                        }

                        // Reference Mode
                        else {
                            if (this.#filesystem) {

                                let res;

                                res = utils.checkFiles(fullPath, this.#filesystem)

                                if (res) {

                                    // Handle Node Specifications
                                    if (
                                        res.default // has a default export
                                        || fullPath.includes('.json') // importing a wasl file
                                    ) node.src = res
                                    // Handle Errors
                                    else {
                                        this.#throw({
                                            type: 'warning',
                                            message: `Node (${name}) at ${fullPath} does not have a default export.`,
                                            file: ogSrc
                                        })
                                        node.src = { default: res }
                                    }

                                    _internal = fullPath
                                }
                                else if (ogSrc) utils.remove(ogSrc, fullPath, name, target)

                            } else {
                                this.#throw({
                                    message: 'No options.filesystem field to get JavaScript objects',
                                    file: ogSrc
                                })
                            }
                        }
                    }


                    if (!_internal) _internal = (ogSrc) ? remoteImport.resolve(ogSrc, url, true) : true // only set if not already present (e.g. for remote cases)

                    let _top = false
                    if (node.graph) {
                        _top = true
                        if (!node.src) node.src = {}
                        node.src.graph = node.graph
                        delete node.graph
                    } 
    

                    // drill into nested graphs
                    if (node.src && node.src.graph) {
                        await this.init(node.src, {
                            _internal,
                            _deleteSrc: options._deleteSrc,
                            _top,
                            _modeOverride
                        }, undefined, symbolsCopy, counter)
                    } else symbolsCopy.push(fullPath) // ensure flow resolutions are properly scoped

                }

                // Load Embedded Src Files
                for (let key in node) {

                    if (
                        !isObj // Alternative Loading Scheme
                        && key === 'src'
                        && node.src) {

                        const language = node.src.language
                        if (!language || languages.js.includes(language)) {

                            // Option #2: Import full ESM text in JSON object
                            if (node.src.text) {
                                const esmImport = async (text) => {
                                    try {
                                        let imported = await remoteImport.importFromText(text)

                                        // NOTE: getting default may be wrong
                                        if (imported.default && Object.keys(imported).length === 1) imported = imported.default
                                        return imported
                                    } catch (e) {
                                        console.error('Import did not work. Probably relies on something...')
                                        this.#throw({
                                            message: e.message,
                                            file: name // NOTE: Is wrong...
                                        })
                                    }
                                }

                                const esm = await esmImport(node.src.text)
                                if (esm) {
                                    delete node.src.text
                                    if (typeof esm === 'object') node.src = { default: Object.assign(node.src, esm) }
                                    else node.src = esm
                                } else {
                                    this.#throw({
                                        message: 'Could not import this text as ESM',
                                        file: node.src
                                    })
                                }
                            }

                            // Option #3: Activate JS functions in JSON object
                            else {

                                const expectedFunctions = ['default', 'oncreate', 'onrender']
                                for (let key in node.src) {
                                    try {
                                        if (expectedFunctions.includes(key) && typeof node.src[key] === 'string') node.src[key] = (0, eval)(`(${node.src[key]})`)
                                    } catch (e) {
                                        this.#throw({
                                            message: `Field ${key} could not be parsed`,
                                            file: node.src[key]
                                        })
                                    }
                                }
                            }
                        }

                        // Option #4: Allow downstream application to parse non-JS text
                        else {
                            console.warn(`Text is in ${language}, not JavaScript. This is not currently parsable automatically.`);
                            this.#throw({
                                message: `Source is in ${language}. Currently only JavaScript is supported.`,
                                file: ogSrc
                            })
                        }
                    }

                    // Drill other object keys to replace and merge src...
                    // NOTE: Sometimes duplicates a check because of looking at name === 'graph' again
                    else if (node[key]) {
                        if (typeof node[key] === 'object' && !Array.isArray(node[key])) {
                            const optsCopy = Object.assign({}, options) as Options
                            optsCopy._deleteSrc = key !== 'nodes' && name !== 'graph' // NOTE: Restricted progression
                            await this.resolve(node[key], info, optsCopy, { nodes: node[key] }, symbolsCopy, counter) // check for src to merge
                        }
                    }
                }

            }
        }


        // Search the nodes that are produced for .src fields
        // to modify it

        // NOTE: If accompanied by an edges object, this is a full graph
        // and should throw errors

        for (let name in nodes) {

            const node = nodes[name]

            // Merge and validate plugins
            if
                (
                node?.src &&
                typeof node?.src === 'object' // Successfully loaded
            ) {

                // Merge node.plugins info with the actual node (i.e. instance) information
                if (node.src.graph) await this.load(node, info, options, id, symbolsRegistry[name]) // attach to graph

                // Only run if parent is a complete graph (i.e. you're an actual node)
                else if (edges) {

                    // VALIDATE: Source files must have a default export
                    if (!('default' in node.src)) {
                        this.#throw({
                            message: 'No default export.',
                            node: name
                        })
                    }

                }

                nodes[name] = utils.merge(node.src, node, options._deleteSrc)

                // Scrub References for ES Plugins
                if (nodes[name].src?.graph) nodes[name].src.graph = JSON.parse(JSON.stringify(nodes[name].graph)) // deep copy the source graph
            }
        }

        return target
    }

    // --------- Main WASL Initialization Function ---------
    // This method loads and merges all the src files
    init = async (
        urlOrObject: string | LatestWASL = this.#input,
        options: Options = this.#options,
        url: string = '',
        symbols = [],
        counter = 0
    ) => {


        if (options.debug) this.debug = {flow: {}, resolutions: {}}
        else this.debug = undefined

        // let symbol = Symbol('init')

        const internalLoadCall = options._internal
        const isFromValidator = !this.#main && typeof internalLoadCall === 'string'
        // Original User Call
        if (!this.#input) this.#input = urlOrObject
        if (!this.#options) this.#options = options
        if (!this.#filesystem) this.#filesystem = options.filesystem

        if (!internalLoadCall) {
            if (!url) url = this.#url // only use for the top-level call

            // Scrub Options for Remote
            try {
                new URL(url ?? urlOrObject)
                options.relativeTo = ''
            } catch { }

        }
        else if (internalLoadCall === true) url = this.#main // use for internal unspecified calls

        // Possibly From Validator
        if (isFromValidator) url = this.#main = internalLoadCall as string// validator input for import syntax

        const clonedOptions = Object.assign({}, options) as Options
        // const isTopLevel = clonedOptions._top !== false
        const innerTopLevel = clonedOptions._top === true
        const isString = typeof urlOrObject === 'string'

        let mode, object, mainPath; // catch internal calls

        // ----------------------- Local Mode Handling -----------------------
        if (typeof urlOrObject === 'object') {
            object = Object.assign({}, urlOrObject)
            if (typeof internalLoadCall === 'string') url = mainPath = remoteImport.resolve(internalLoadCall) // use internal call as base
            mode = 'reference'
        } else if (url || (isString)) {
            if (!url) url = remoteImport.resolve(urlOrObject, options.relativeTo ?? '')
            mode = 'import'
        }
        else console.error('Mode is not supported...')

        if (!internalLoadCall) this.#mode = mode // set global mode


        mode = clonedOptions._modeOverride ?? this.#mode // set local to global mode

        // Check if input is valid
        this.errors.push(...check.valid(urlOrObject, clonedOptions, 'load'))

        // maintain a reference to the main path

        // ------------------- Merge package.json and (optionally) resolve object-------------------

        switch (mode) {
            case 'reference':

                // Graphs Nested in the Top Level Don't Have a package.json File
                if (!innerTopLevel) {
                    if (this.#filesystem) {
                        const pkgPath = remoteImport.resolve(basePkgPath, url)
                        const pkg = utils.checkFiles(pkgPath, this.#filesystem)
                        if (pkg) object = Object.assign(pkg, isString ? {} : object) as any
                        // else utils.remove(basePkgPath, pkgPath) // Package.json files are not required...
                    }
                }

            default:
                if (!object) {
                    mainPath = await remoteImport.resolve(url)
                    object = await this.get(mainPath, undefined) as LatestWASL
                    if (!innerTopLevel) {
                        const pkgUrl = remoteImport.resolve(basePkgPath, mainPath, true)
                        const pkg = await this.get(pkgUrl, undefined)
                        if (pkg) object = Object.assign(pkg, object) as any
                    }
                }
        }

        if (!internalLoadCall) this.#main = mainPath // save global main path
        else if (this.#mode === 'reference' && !this.#main) this.#main = '' // ensures root scope


        if (this.debug){
            let target = this.debug.flow
            symbols.forEach(str => target = target[str])
            target[mainPath] = {}
            symbols.push(mainPath)

            if (mainPath) {
                if (!this.debug.resolutions[mainPath]) this.debug.resolutions[mainPath] = { _resolutions: 0, _depth: [], _time: [] }
                const res = this.debug.resolutions
                res[mainPath]._resolutions++
                res[mainPath]._depth.push(counter)
                res[mainPath]._time.push(Date.now() - startTime)
            }
        }

        if (this.errors.length === 0) {

            // replace src with actual source text
            const nodes = object.graph.nodes

            await this.resolve(nodes, {
                mainPath,
                url,
                object,
            }, clonedOptions, object.graph, symbols, counter)


            // convert valid nodes to ES Plugins
            const drill = (parent, callback) => {
                const nodes = parent.graph.nodes
                for (let tag in nodes) {
                    const res = callback(nodes[tag], {
                        tag,
                        parent,
                        options: clonedOptions
                    })

                    if (res) nodes[tag] = res
                }
            }

            // -------------------------- do plugin-dependent tests --------------------------
            const drillToTest = (target) => {
                drill(target, (node, info) => {

                    // VALIDATE: Check that all edges point to valid nodes
                    const edges = info.parent.graph.edges
                    for (let output in edges) {

                        const getTarget = (o, str) => o.graph?.nodes?.[str] ?? o[str]

                        let outTarget = info.parent.graph.nodes
                        output.split('.').forEach((str) => outTarget = getTarget(outTarget, str))

                        if (!outTarget) {
                            this.#throw({
                                message: `Node '${output}' (output) does not exist to create an edge.`,
                                file: url,
                            })
                        }

                        for (let input in edges[output]) {
                            let inTarget = nodes
                            input.split('.').forEach((str) => inTarget = getTarget(inTarget, str))
                            if (!inTarget) {
                                this.#throw({
                                    message: `Node '${input}' (input) does not exist to create an edge.`,
                                    file: url,
                                })
                            }
                        }
                    }

                })
            }

            // -------------------------- initialize plugins --------------------------
            if (internalLoadCall === undefined) {
                if (clonedOptions.output !== 'object') {

                    // Convert to ES Plugin
                    this.plugin = new ESPlugin(object, {
                        activate: clonedOptions.activate,
                        parentNode: clonedOptions.parentNode
                    })

                    // Derive Original Input
                    this.original = Object.assign({}, this.plugin.initial)
                    let drillCopy = (target) => {
                        if (target?.graph) {
                            let graph = Object.assign({}, target.graph)
                            let nodes = graph.nodes = Object.assign({}, graph.nodes)
                            if (nodes) {
                                for (let k in nodes) {
                                    nodes[k] = Object.assign({}, nodes[k].initial)
                                    drillCopy(nodes[k])
                                }
                            }
                            target.graph = graph
                        }
                    }
                    drillCopy(this.original)

                    return this.plugin
                } else this.original = object

                drillToTest(object) // test
            }

            return object
        }
    }

    start = async () => {
        if (this.plugin) return await this.plugin.start()
    }

    stop = async () => {
        if (this.plugin) return await this.plugin.stop()
    }


}


export default WASL