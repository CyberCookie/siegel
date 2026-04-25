import type { Server } from 'http'
import type {
    Http2Server, Http2Stream, IncomingHttpHeaders, OutgoingHttpHeaders
} from 'http2'
import type { FastifyInstance } from 'fastify'
import type { ConfigObject, WebpackMiddlewares } from '../types'
import type { GetStaticFileResponseParams } from './get_static_file_response_data/types'



type FastifyHTTPServer = FastifyInstance<Server>
type FastifyHTTP2Server = FastifyInstance<Http2Server>


type ServerExtenderFn = (
    staticServer: FastifyHTTPServer | FastifyHTTP2Server,
    config: ConfigObject,
    fastify: typeof import('fastify')
) => Promise<void> | void

type StaticServingData = ReturnType<GetStaticFileResponseParams>


type ServerConfig = {
    /** User defined server to extend the one created by Siegel */
    appServer?: ServerExtenderFn

    /** Static server host. Default is localhost */
    host?: string

    /** Static server port. Default is 3000 */
    port?: string | number

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

    /** Executes right before file send
     *
     * @param req - Express.js request
     * @param res - Express.js response
     * @param staticServingData - File serving params
     * @returns true to prevent default file send handler
    */
    HTTP1PreFileSend?(
        req: Request,
        res: Response,
        staticServingData: StaticServingData
    ): boolean

    /** Executes right before file send
     *
     * @param stream - Node http2 stream
     * @param headers - Node http2 request headers
     * @param resHeaders - Node http2 response headers
     * @param staticServingData - File serving params
     * @returns true to prevent default file send handler
    */
    HTTP2PreFileSend?(
        stream: Http2Stream,
        reqHeaders: IncomingHttpHeaders,
        resHeaders: OutgoingHttpHeaders,
        staticServingData: StaticServingData
    ): boolean
}


type ServerBootParams = {
    config: ConfigObject
    devMiddlewares: WebpackMiddlewares
}


export type {
    ServerConfig,
    FastifyHTTPServer, FastifyHTTP2Server,
    ServerBootParams, ServerExtenderFn//, ExpressExtenderParams, HTTP2ExtenderParams
}