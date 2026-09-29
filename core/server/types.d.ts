import type { ConfigObject, WebpackMiddlewares } from '../types'


type ServerExtenderFnReturn = {
    response?: Response
    preventDefaultFileReqResolve?: boolean
}
type ServerExtenderFn = (
    req: Request,
    server: Bun.Server<unknown>
) => Promise<ServerExtenderFnReturn> | ServerExtenderFnReturn


type ServerConfig = {
    /** User defined server to extend the one created by Siegel */
    appServer?: ServerExtenderFn

    /** Static server host. Default is localhost */
    host?: string

    /** Static server port. Default is 3000 */
    port?: string | number

    /** Enable HTTP2 */
    http2?: boolean

    /** Enable HTTP/3 (QUIC) */
    http3?: boolean

    /** SSL params to establish secure connection */
    ssl?: {
        /** Path to ssl private key */
        keyPath: string

        /** Path to signed certificate */
        certPath: string
    }

    /** Compressed files lookup order */
    serveCompressionsPriority?: readonly string[]

    /** Executes right before file send
     *
     * @param req - Request
     * @param res - Response
     * @returns true to prevent default file response handling
    */
    handleResourceRequest?(
        req: Request,
        res: Response
    ): boolean
}


type ServerBootParams = {
    config: ConfigObject
    devMiddlewares: WebpackMiddlewares
}


export type { ServerConfig, ServerBootParams, ServerExtenderFn }