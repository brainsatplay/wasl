// import { Plugin } from '../../versions/0.0.0/component.schema'

import WASL from "src/core"

export type LatestWASL = any //Plugin

export type ActiveSrc = {
    extension: 'string',
    text: 'string'
}

export type Options = {
    version?: string,
    relativeTo?: string,
    filesystem?: {
        [x:string]: LatestWASL
    },
    path?: string, // Same as URL, for HTML...
    

    debug?: boolean
    output?: 'plugin' | 'object'
    wasl?: WASL

    nodeModules?: string
    callbacks?: {
        progress: {
            source: (label: string, i: number, total: number) => void,
            component: (label: string, i: number, graph: any) => void,

            // For ESMpile
            fetch: (path:string, i:number, total:number, done:undefined|any, failed:undefined|Error) => void, 
            file: (path:string, i:number, total:number, done:undefined|any, failed:undefined|any, range: string) => void,
        }
    }
   
    _internal?: string | boolean
    _deleteSrc?: boolean
    _remote?: string
    _top?: boolean
    _modeOverride?: boolean

    // ES Components
    activate?: boolean
    parentNode?: HTMLElement
}