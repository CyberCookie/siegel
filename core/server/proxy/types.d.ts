import type { RequestOptions, IncomingMessage } from 'http'
import type { RequestHandler } from 'express'


type ProxyParams = {
    /** Destination host */
    host: string

    /** Destination port */
    port?: number

    /** Rewrites origin query params [doesn't affect web socket subscription] */
    query?: Obj<string>

    /** Rewrites origin path [doesn't affect web socket subscription] */
    path?: string

    /** Replaces origin host header with target host */
    changeOrigin?: boolean

    /** Makes request over https */
    secure?: boolean

    /** Enables web socket proxying */
    ws?: boolean

    /** Called after proxy request options is formed giving full controll over the proxy request options */
    postProcessReq?(
        /** Request from origin */
        clientReq: Parameters<RequestHandler>[0] | IncomingMessage,

        /** Mutable proxy request options */
        options: RequestOptions
    ): void
}

type Proxy = (params: ProxyParams) => RequestHandler


export type { Proxy, ProxyParams }