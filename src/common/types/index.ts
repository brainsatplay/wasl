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

    output?: 'plugin' | 'object'
    fromValidator?: boolean
    wasl?: WASL

   
    _internal?: string | boolean
    _deleteSrc?: boolean
    _remote?: string
    _top?: boolean
    _modeOverride?: boolean

    // ES Components
    activate?: boolean
    parentNode?: HTMLElement
}