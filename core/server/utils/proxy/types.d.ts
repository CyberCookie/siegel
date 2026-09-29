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
        /** Proxy target URL */
        targetUrl: string,

        /** Mutable proxy request options */
        options: BunFetchRequestInit
    ): string | undefined
}


export type { ProxyParams }