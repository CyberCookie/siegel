import type { Http2Server, Http2SecureServer } from 'http2'
import type { RequestHandler, Express } from 'express'
import type { ConfigFinal } from '../types'
import type { StreamCB } from './http2/types'


type ExpressExtenderParams = {
    staticServer: Express
    express: typeof import('express')
    onStream?: never
}
type HTTP2ExtenderParams = {
    staticServer: Http2Server | Http2SecureServer
    onStream(cb: StreamCB): void
    express?: never
}
type ServerExtenderFn = (
    params: ExpressExtenderParams | HTTP2ExtenderParams,
    config: ConfigFinal
) => Promise<void> | void


type ServerConfig = {
    appServer?: ServerExtenderFn
    host?: string
    port?: number
    http2?: boolean
    ssl?: {
        keyPath: string
        certPath: string
    }
    serveCompressionsPriority?: readonly string[]
}

type ServerConfigDefault = {
    host: NonNullable<ServerConfig['host']>
    port: NonNullable<ServerConfig['port']>
    serveCompressionsPriority: NonNullable<ServerConfig['serveCompressionsPriority']>
}

type ServerConfigFinal = ServerConfig & ServerConfigDefault


type ServerBootParams = {
    CONFIG: ConfigFinal
    devMiddlewares: RequestHandler[]
}


export type {
    ServerConfig, ServerConfigDefault, ServerConfigFinal,
    ServerBootParams, ServerExtenderFn, ExpressExtenderParams, HTTP2ExtenderParams
}