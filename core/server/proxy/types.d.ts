import type { RequestOptions, IncomingMessage } from 'http'
import type { RouteHandlerMethod, FastifyRequest } from 'fastify'


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

    /**
     * You should specify ws connection endpoints for this destination
     * if you proxy to multiple backends using same fastify server
     */
    wsEndpoints?: Array<string>

    /** Called after proxy request options is formed giving full controll over the proxy request options */
    postProcessReq?(
        /** Request from origin */
        clientReq: FastifyRequest | IncomingMessage,

        /** Mutable proxy request options */
        options: RequestOptions
    ): void
}

type Proxy = (params: ProxyParams) => RouteHandlerMethod


export type { Proxy, ProxyParams }