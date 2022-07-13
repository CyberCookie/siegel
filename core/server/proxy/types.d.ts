import type { IncomingHttpHeaders } from 'http'
import type { RequestHandler } from 'express'


type ProxyParams = {
    host: string
    port?: number
    path?: string
    query?: string
    method?: string
    headers?: Indexable<string>
    changeOrigin?: boolean
    secure?: boolean
    postProcessReq?: (
        clientReq: Parameters<RequestHandler>[0],
        options: {
            host: ProxyParams['host']
            port: ProxyParams['port']
            method: ProxyParams['method']
            headers: IncomingHttpHeaders
            path: NonNullable<ProxyParams['path']>
        }
    ) => void
}

type Proxy = (params: ProxyParams) => RequestHandler


export type { Proxy }