import { LatestWASL, Options } from "../common/types"
import * as languages from '../common/utils/languages'
import get from '../common/get'
import * as check from '../common/utils/check'
import * as utils from './utils'

import * as remoteImport from 'remote-esm'
import ESPlugin from "es-plugins/dist/index.esm"

const basePkgPath = './package.json'
const moduleStringTag = '[object Module]'

class WASL {

    errors: any[] = []
    warnings: any[] = []
    files: { [x: string]: any } = {}
    plugin?: ESPlugin

    // Records
    original?: { [x: string]: any } = {}
    resolved?: { [x: string]: any } = {}

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

    get = async (...args) => await get(args[0], args[1], this.#onImport, this.#options).catch(e => e)


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

                            newInfoForNode = (await this.resolveOld({ [key]: newInfo }, info, optsCopy, {
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
    resolveOld = async (target, info, options, graph: any = {}, symbols: string[] = [], counter) => {
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
                        if (!options._overrideRemote || options._modeOverride === 'import') {
                            _modeOverride = "import";
                            _internal = fullPath = ogSrc;
                        } else fullPath = `${ogSrc.split('://').slice(1).join('/')}` // no protocol
                    } catch {
                        if (ogSrc) fullPath = mainPath ? remoteImport.resolve(ogSrc, mainPath) : remoteImport.resolve(ogSrc);
                    }

                    let mode = options._modeOverride ?? this.#mode

                    // Only Get Source based on the value present (though mainPath will allow for relative resolutions)
                    if (ogSrc) {

                        //Import Mode
                        if (_internal || mode === 'import') {
                            let res = await this.get(fullPath, undefined) as LatestWASL
                            const isError = res instanceof Error;
                            if (res && !isError) node.src = res
                            if (!node.src && !node.graph) {
                                utils.remove(ogSrc, fullPath, name, target, res) // remove if no source and no graph
                                if (res) this.#throw({ message: res.message, file: fullPath, type: 'warning' })
                            }
                        }

                        // Reference Mode
                        else {
                            if (this.#filesystem) {

                                let res;

                                res = utils.checkFiles(fullPath, this.#filesystem)
                                const isError = res instanceof Error;

                                if (res && !isError) {

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
                                else if (ogSrc) {
                                    utils.remove(ogSrc, fullPath, name, target, res)
                                    if (res) this.#throw({ message: res.message, file: fullPath, type: 'warning' })
                                }

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
                            _modeOverride,
                            _overrideRemote: options._overrideRemote
                        }, undefined)
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
                            await this.resolveOld(node[key], info, optsCopy, { nodes: node[key] }, symbolsCopy, counter) // check for src to merge
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

                nodes[name] = utils.merge(node.src, node)

                // Scrub References for ES Plugins
                if (nodes[name].src?.graph) nodes[name].src.graph = JSON.parse(JSON.stringify(nodes[name].graph)) // deep copy the source graph
            }
        }

        return target
    }
    

    // ------------------------------- NEW METHODS -------------------------------
    // This method resolves the JavaScript object associated with a source string
    resolveSource = async (path, modeOverride, {
        useCache = true,
        mode = 'reference'
    } = {}) => {

        const activeMode = modeOverride ?? mode // fallback to options

        //Import Mode
        let res = null

        if (activeMode === 'import') {

            // Cached Version
            if (this.#cache[path] && useCache) {
                console.warn('Found cached component', path)
                res = this.#cache[path]
            } 
            
            // Remote Version
            else res = await this.get(path, undefined) as LatestWASL
        }

        // Reference Mode
        else if (this.#filesystem) res = utils.checkFiles(path, this.#filesystem)
        else {
            this.#throw({
                message: 'No options.filesystem field to get JavaScript objects',
                file: path
            })
        }

        return res
    }


    // This method searches the JSON object for a search key and uses the onFound callback to notify the user + provide additional metadata.
    search = async (input, searchKey = 'src', {
        condition = (value) => typeof value === 'string',
        onFound = async (o, acc: any = []) => acc.push(o),
        mainPath,
        nestedKey,
        mode
    }) => {


        const top = input
        let found;

        const pathMap = {}
        // const infoMap = {}
        // const infoRegistry = {}

        const drill = async (input, tree=[]) => {

            // Handle Search Key
            const parentInfo = tree[tree.length - 1]

            const path = tree.map((o) => o.key)
            const graphSlice = path.slice(-3)

            const get = (pathInfo=path) => {
                let target = top
                pathInfo.forEach((str,i) =>target = target[str])
                return target
            }

            const set = (input, key=searchKey, pathInfo=path) => {
                let target = top
                pathInfo.forEach((str,i) => target = target[str])
                target[key] = input
            }

            if (condition(input[searchKey])) {

                const isComponent = graphSlice.slice(-2)[0] === 'components' // Got an internal component


                // Remap Path from Override Transformations
                let target = pathMap
                path.forEach((str,i) => target = target[str] ?? target)
                const pathArray = (Array.isArray(target))  ? path.map((str,i) => target[i] ?? str) : path

                // let overrides = infoMap
                // path.forEach((str,i) => overrides = overrides[str] ?? overrides)

                let o = {

                    // Resolution Info
                    mainPath,
                    mode,
                    isComponent,

                    paths: {
                        original: path,
                        remapped: pathArray
                    },

                    // Value Info
                    get,
                    set,
                    key: searchKey,
                    value: input[searchKey],
                    
                    // Set Parent Reference
                    setParent: function (input, path=this.paths.remapped, fallbackKey) {
                        let target = top
                        path.forEach((str,i) => {
                            if (i === path.length - 1) {
                                if (fallbackKey && Object.keys(target[str]).length > 1) {
                                    console.warn(`Setting ${fallbackKey} instead of replacing parent for ${path.join('.')}`)
                                    target[str][fallbackKey] = input;
                                } else target[str] = input;
                            }
                            else target = target[str]
                        })
                    },

                    // Parent Info
                    parent: parentInfo?.reference,
                    name: parentInfo?.key,

                    // ...overrides
                }

                // infoRegistry[path.toString()] = o

                // Mark as Resolved
                input[searchKey] = null

                if (onFound) {
                    const got = await onFound(o, found)
                    if (got && typeof got === 'object') found = got
                }
            }


            
            // Catch Certain Info
            if (nestedKey) {

                const offset = path.length - graphSlice.length
                for (let key in nestedKey) {
                    let i = 0
                    
                    const pattern = nestedKey[key].pattern
                    const match = (pattern) ? pattern.reduce((a,o) => {
                        let str = o?.key ?? o
                        let adjacencies = o?.adjacencies
                        if (typeof str === 'string') a *= ((graphSlice[i] === str) ? 1 : 0)
                        if (adjacencies) a *= adjacencies.reduce((a,str) => {
                            a *=(str in get(path.slice(0,offset+i)) ? 1 : 0)
                            return a
                        }, 1)
                        
                        i++
                        return a
                    }, 1) : 1

                    const projection = nestedKey[key].projection ?? pattern
                    // const update = nestedKey[key].update

                    if (match) {

                            await nestedKey[key].function(input, {
                            get: (key) => get([...path, key]),
                            set: (key, name, value) => {
                                const base = [...path.slice(0,offset), ...projection.map((str,i) => (!str) ? graphSlice[i] : str)]
                                const passed = [...base, name]
                                set(value, key, passed) // relative

                                // Remap override source resolutions to the new object
                                let targets = [
                                    {
                                        target: pathMap,
                                        update: passed,
                                        array: graphSlice
                                    }, 
                                    // {
                                    //     target: infoMap,
                                    //     array: path
                                    // }
                                ]

                                const create = (target, array) => {
                                    array.forEach(str => {
                                        if (!target[str]) target[str] = {}
                                        target = target[str]
                                    })
                                    return target
                                }

                                targets.forEach(o => {
                                    const target = create(o.target, o.array)
                                    if (o.update) target[name] = o.update /// absolute
                                    o.target = target
                                })
                                
                                // const map = targets[1].target
                                // const baseStr = base.slice(0,-1).toString()
                                // const parentInfo = infoRegistry[baseStr]
                                // if (update) update(map, parentInfo)

                            },
                            delete: () => delete get([...path])[key],
                        }) // intercept key
                    }
                }
            }

            // Drill the Object for the Search Key
            for (let key in input) {
                if (input[key] && typeof input[key] === 'object') await drill(input[key], [...tree, { reference: input, key }])
            }

        }

        await drill(input)

        return found
    }


    // This method searches the JSON object for the "src" field and adds additional information to the found object
    findSources = async (graph, events, opts) => {

        return await this.search(graph, undefined, {
            mode: opts.mode,
            nestedKey: events.nested,
            onFound: async (o, acc = {}) => {

                // Add Type
                o.type = 'local'

                try {
                    new URL(o.value);
                    o.type = 'remote'
                } catch { }

                const isRemote = o.type === 'remote'

                // Add Path
                const main = o.mainPath || this.#main // use base main if not specified
                o.path = isRemote ? o.value : ((main) ? remoteImport.resolve(o.value, main) : remoteImport.resolve(o.value)) // do not maintain relative paths

                // Change Import Method
                if (isRemote) o.mode = 'import'

                // Add to Accumulator
                const ext = o.value.split('/').pop().split('.').slice(1).join('.')
                if (ext === 'wasl.json') {
                    if (events.components) await events.components(o)
                    // else o.isComponent = false
                    return null
                } else {
                    if (!acc[ext]) acc[ext] = {}
                    if (!acc[ext][o.path]) acc[ext][o.path] = []
                    acc[ext][o.path].push(o)
                    return acc
                }
            },
            mainPath: opts.mainPath
        })
    }

    // This method resolves all source values in the JSON object
    // 1. Collect all the source strings and notify of remote graphs that are resolved
    // 2. Flatten the source strings found in internal graphs into the main collection
    // 3. Resolve all the source strings into JavaScript objects and notify the user of their resolution
    resolve = async (graph, context, opts: Options={}) => {

        const remote = [] // don't immediately resolve
        const nested = [] // to merge

        const foundInternal = {}

        // Resolve Graphs Immediately + Merge Plugins
        const events = {
            components: (info) => this.handleComponent(info, events, context, opts, remote, foundInternal),
            nested: {
                overrides: {
                    pattern: ['components', null, {key: 'overrides', adjacencies: ['src']}],
                    projection: ['components', null, 'components'],
                    function: (value, info) => this.handleOverride(value, info, nested),
                    update: (o, info) => {
                        o.mainPath = info.path // set mainPath to 
                    }
                }
            }
        }

        // ---------------------------- Get All Sources ----------------------------
        // Find Sources
        const found = await this.findSources(graph, events, context) ?? {} // might not have sources

        // Transfer Sources 
        this.flattenInto(foundInternal, found)

        // ---------------------------- Resolve Non-Graph Sources ----------------------------
        const tic = performance.now()
        const total = Object.keys(found).reduce((acc, key) => acc + Object.keys(found[key]).length, 0)

        let i = 0;

        // Asynchronously Resolve All Sources
        await Promise.all(Object.values(found).map(async (typeInfo) => {
            await Promise.all(Object.entries(typeInfo).map(async ([path, pathInfo]) => {
                const res = await this.resolveSource(path, pathInfo[0].mode) // will remain consistent...
                await Promise.all(pathInfo.map(async (info) => await this.handleResolved(res, info)))
                i++
                if (opts.callbacks?.sourceProgress instanceof Function) opts.callbacks.sourceProgress(path, i, total)
            }))
        }))

        const toc = performance.now()

        console.log('Resolved', total, 'sources in', toc - tic, 'ms')


        return graph
    }


    // This method updates the context of the current source resolution
    updateContext = (info, context) => {
        return {
            ...context,
            mainPath: info.path,
            mode: (info.type === 'remote') ? 'import' : context.mode
        }
    }

    // This methods flattens found entries into each other
    flattenInto = (o1, o2) => {
        for (let type in o1) {
            for (let path in o1[type]) {
                if (!o2[type]) o2[type] = {}
                if (!o2[type][path]) o2[type][path] = []
                o2[type][path].push(...o1[type][path])
            }
        }
    }

    // This method handles a resolved source string, and will be called for every source value in the JSON object.
    handleResolved = (res, info) => {

        const ogSrc = info.value
        const name = info.name


        // Handle Error
        const isError = res instanceof Error;

        // Check if ES Module
        const isModule = res && (!!Object.keys(res).reduce((a,b) => {
            const desc = Object.getOwnPropertyDescriptor(res, b)
            const isModule = (desc && desc.get && !desc.set) ? 1 : 0
            return a + isModule
        }, 0) || Object.prototype.toString.call(res) === moduleStringTag)

        const hasDefault = !!res?.default
        const isWASL = info.path.includes('wasl.json')

        // Pass the Resolved Source Value
        if (res && !isError) {

            // Throw Warning about Default Exports
            if (isModule && !hasDefault && !isWASL) this.#throw({
                type: 'warning',
                message: `Node (${name}) at ${info.path} does not have a default export.`,
                file: ogSrc
            })
        }

        // Could not Resolve the Source Value
        else {
            utils.remove(ogSrc, info.path, name, info.parent, res) // remove if no source
            if (res) this.#throw({ message: res.message, file: info.path, type: 'warning' })
            return // stop execution here
        }

        // Assign the Source Value

        if (res !== undefined) {

            // Set Source
            if ((!isModule || !info.isComponent) && !isWASL) info.setParent((isModule) ? res.default : res, undefined, info.key)
            else {
                info.set(res) // set src key on the main reference
                const ref = info.get()
                info.setParent(utils.merge(ref[info.key], ref)) // merge source into the parent node
            }

            return res // return when resolved appropriately
        }
    }

    // This method responds to a new (remote) component se that is found
    handleComponent = async (info, events, context, opts, acc = [], list = {}) => {

        const newContext = this.updateContext(info, context)
        info.mode = newContext.mode // align modes
        const res = await this.resolveSource(info.path, info.mode, newContext)

        const found = await this.findSources(res, events, newContext)
        if (opts.callbacks?.componentProgress instanceof Function) opts.callbacks.componentProgress(info.path, acc.length, res)

        // Register Internal Sources
        if (found) this.flattenInto(found, list)

        await this.handleResolved(res, info)

        acc.push(info) // accumulate graphs
        return acc
    }

    // This methods responds to the "overrides" keyword, flattening entries into the nested graphs
    handleOverride = async (value, info, acc = []) => {
        
        for (let nestedName in value) {

            const nestedNode = info.get(nestedName)
            
            // Merge Specified Information into the Node (will keep sources as strings...)
            if (nestedNode) {
                for (let key in value[nestedName]) {
                    const newInfo = value[nestedName][key]
                    if (newInfo) info.set(key, nestedName, newInfo) 
                }
            } else this.#throw({
                message: `Plugin target '${nestedName}' does not exist`,
                node: name
            })

            acc.push(value)
            return acc
        }

        info.delete() //delete value[info.refKey]

    }


    // --------- Main WASL Initialization Function ---------
    // This method loads and merges all the src files
    init = async (
        urlOrObject: string | LatestWASL = this.#input,
        options: Options = this.#options,
        url: string = ''
    ) => {

        this.debug = undefined // no debug behavior specified

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
            if (!url) url =  (urlOrObject[0] === '.') ? remoteImport.resolve(urlOrObject, options.relativeTo ?? '') : urlOrObject // Use Relative vs Absolute Path
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

                this.original = object

                // Graphs Nested in the Top Level Don't Have a package.json File
                if (!innerTopLevel) {
                    if (this.#filesystem) {
                        const pkgPath = remoteImport.resolve(basePkgPath, url)
                        const pkg = utils.checkFiles(pkgPath, this.#filesystem)
                        if (pkg) object = Object.assign(pkg, isString ? {} : object) as any
                    }
                }
                break;

            default:
                if (!object) {
                    mainPath = await remoteImport.resolve(url)
                    this.original = await this.get(mainPath, undefined) as LatestWASL
                    object = JSON.parse(JSON.stringify(this.original))
                    if (!innerTopLevel) {
                        const pkgUrl = remoteImport.resolve(basePkgPath, mainPath, true)
                        const pkg = await this.get(pkgUrl, undefined)
                        if (pkg) object = Object.assign(pkg, object) as any
                    }
                }
                break;

        }

        if (!internalLoadCall) this.#main = mainPath // save global main path
        else if (this.#mode === 'reference' && !this.#main) this.#main = '' // ensures root scope

        if (this.errors.length === 0) {

            const copy = JSON.parse(JSON.stringify(this.original))
            // Resolve without including information from pkg
            this.resolved = await this.resolve(copy, { mainPath, mode }, options)

            // convert valid nodes to ES Plugins
            const drill = (parent, callback) => {
                const nodes = parent.components
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
                    // TODO: Validate children...
                    const connections = info.parent.listeners
                    for (let output in connections) {

                        const getTarget = (o, str) => o.components?.[str] ?? o[str]

                        let outTarget = info.parent.components
                        output.split('.').forEach((str) => outTarget = getTarget(outTarget, str))

                        if (!outTarget) {
                            this.#throw({
                                message: `Node '${output}' (output) does not exist to create an edge.`,
                                file: url,
                            })
                        }

                        for (let input in connections[output]) {
                            let inTarget = this.resolved.components
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
                    this.plugin = new ESPlugin(this.resolved, {
                        activate: clonedOptions.activate,
                        parentNode: clonedOptions.parentNode
                    })

                    // Derive Original Input
                    return this.plugin
                } else this.original = this.resolved

                // TODO: Check edges still...
                drillToTest(this.resolved) // test
            }

            return this.resolved
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