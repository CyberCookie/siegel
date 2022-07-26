import type { RequestHandler } from 'express'
import type { ConfigFinal, ServerExtenderFn } from '../types'


type ServerConfig = {
    appServerLoc?: string
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
    appServer: ServerExtenderFn | undefined
}


export type {
    ServerConfig, ServerConfigDefault, ServerConfigFinal,
    ServerBootParams
}