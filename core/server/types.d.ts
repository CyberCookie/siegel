import type { Server as NodeHTTPServer } from 'http'
import type { Server as NodeHTTPServerSecure } from 'https'
import type {
    Http2Server as NodeHTTP2Server,
    Http2SecureServer as NodeHTTP2ServerSecure
} from 'http2'
import type {
    FastifyInstance, FastifyRequest, FastifyReply,
    FastifyServerOptions, FastifyHttpsOptions,
    FastifyHttp2Options, FastifyHttp2SecureOptions
} from 'fastify'
import type { ConfigObject, WebpackMiddlewares } from '../types'



type FastifyHTTPServer = FastifyInstance<NodeHTTPServer>

type FastifyHTTPServerSecure = FastifyInstance<NodeHTTPServerSecure>
type FastifyHTTPSOptions = FastifyHttpsOptions<NodeHTTPServerSecure>

type FastifyHTTP2Server = FastifyInstance<NodeHTTP2Server>
type FastifyHTTP2Options = FastifyHttp2Options<NodeHTTP2Server>

type FastifyHTTP2ServerSecure = FastifyInstance<NodeHTTP2ServerSecure>
type FastifyHTTP2SOptions = FastifyHttp2SecureOptions<NodeHTTP2ServerSecure>

type FastifyAllServerOptions = FastifyServerOptions | FastifyHTTPSOptions | FastifyHTTP2Options | FastifyHTTP2SOptions


type ServerExtenderFn = (
    staticServer: FastifyHTTPServer | FastifyHTTPServerSecure | FastifyHTTP2Server | FastifyHTTP2ServerSecure,
    config: ConfigObject,
    fastify: typeof import('fastify')
) => Promise<void> | void


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
     * @param req - Fastify request
     * @param res - Fastify response
     * @returns true to prevent default file response handling
    */
    handleResourceRequest?(
        req: FastifyRequest,
        res: FastifyReply
    ): boolean
}


type ServerBootParams = {
    config: ConfigObject
    devMiddlewares: WebpackMiddlewares
}


export type {
    ServerConfig, ServerBootParams, ServerExtenderFn,
    FastifyHTTPServer, FastifyServerOptions, FastifyHTTPServerSecure, FastifyHTTPSOptions,
    FastifyHTTP2Server, FastifyHTTP2Options, FastifyHTTP2ServerSecure, FastifyHTTP2SOptions,
    FastifyAllServerOptions
}