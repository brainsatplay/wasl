// import { Plugin } from '../../versions/0.0.0/component.schema'

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

    errors?: any[],
    warnings?: any[],
    _internal?: string | boolean
    _deleteSrc?: boolean
}