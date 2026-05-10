import type { BuildConfig } from './client_build/types'
import type { WebpackMiddlewares } from './client_build/'
import type {
    ServerConfig, ServerExtenderFn,
    FastifyHTTPServer, FastifyHTTPServerSecure, FastifyHTTP2Server, FastifyHTTP2ServerSecure
} from './server/types'


type ConfigObject = {
    /** Siegel run modes */
    runMode?: {
        /** Should run server to host client */
        isServer?: boolean

        /** Should perform client build */
        isBuild?: boolean

        /** Is production mode */
        isProd?: boolean
    }

    /** Client build output dir and static server public dir */
    publicDir?: string

    /** Webpack params */
    build?: BuildConfig

    /** Static server params */
    server?: ServerConfig
}
type Config = ConfigObject | string


export type {
    Config, ConfigObject,
    WebpackMiddlewares, ServerExtenderFn,
    FastifyHTTPServer, FastifyHTTPServerSecure, FastifyHTTP2Server, FastifyHTTP2ServerSecure
}