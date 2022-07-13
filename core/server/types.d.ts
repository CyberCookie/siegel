import type { RequestHandler } from 'express'
import type { ConfigFinal } from '../types'


type ServerExtender = (...args: any[]) => any


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
    appServer: ServerExtender
}


export type {
    ServerConfig, ServerConfigDefault, ServerConfigFinal,
    ServerBootParams
}