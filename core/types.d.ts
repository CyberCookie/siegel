import type { Http2Server, Http2SecureServer } from 'http2'
import type { Express } from 'express'
import type { BuildConfig, BuildConfigDefault, BuildConfigFinal } from './client_build/types'
import type { ServerConfig, ServerConfigDefault, ServerConfigFinal } from './server/types'
import type { StreamCB } from './server/http2/types'


type Config = {
    publicDir?: string
    build?: BuildConfig
    server?: ServerConfig
} | string

type ConfigDefault = {
    publicDir: NonNullable<Config['publicDir']>
    build: BuildConfigDefault
    server: ServerConfigDefault
}

type ConfigFinal = {
    publicDir: NonNullable<Config['publicDir']>
    server: ServerConfigFinal
    build: BuildConfigFinal
}


type RunParams = {
    isServer?: boolean
    isBuild?: boolean
    isProd?: boolean
}

type RunParamsFinal = {
    _isDevServer: boolean
    _isSelfDevelopment: boolean
} & Required<RunParams>



type ExpressExtenderParams = {
    staticServer: Express
    express: typeof import('express')
    onStream?: never
}
type HTTP2ExtenderParams = {
    staticServer: Http2Server | Http2SecureServer
    express?: never
    onStream: (cb: StreamCB) => void
}
type ServerExtenderFn = (
    params: ExpressExtenderParams | HTTP2ExtenderParams,
    config: ConfigFinal
) => Promise<void> | void



export type {
    ServerExtenderFn,
    Config, ConfigDefault, ConfigFinal,
    RunParams, RunParamsFinal
}