import { Plugin } from '../../versions/0.0.0/plugin.schema'

export type LatestWASL = Plugin

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
    _internal?: boolean
}