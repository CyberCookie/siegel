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
    /** User defined server to extend the one created by Siegel */
    appServer?: ServerExtenderFn

    /** Static server host */
    host?: string

    /** Static server port */
    port?: number

    /** Whether to use HTTP2 protocol */
    http2?: boolean

    /** SSL params to establish secure connection */
    ssl?: {
        /** Path to ssl private key */
        keyPath: string

        /** Path to signed certificate */
        certPath: string
    }

    /** Compressed files lookup order */
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