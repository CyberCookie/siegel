import type { BuildConfig, BuildConfigDefault, BuildConfigFinal } from './client_build/types'
import type {
    ServerConfig, ServerConfigDefault, ServerConfigFinal,
    ServerExtenderFn, ExpressExtenderParams, HTTP2ExtenderParams
} from './server/types'


type Config = {
    /** Client build output dir and static server public dir */
    publicDir?: string

    /** Webpack params */
    build?: BuildConfig

    /** Static server params */
    server?: ServerConfig
} | string

type ConfigDefault = {
    publicDir: NonNullable<Exclude<Config, string>['publicDir']>
    build: BuildConfigDefault
    server: ServerConfigDefault
}

type ConfigFinal = {
    publicDir: NonNullable<Config['publicDir']>
    server: ServerConfigFinal
    build: BuildConfigFinal
}


type RunParams = {
    /** Should run server to host client */
    isServer?: boolean

    /** Should perform client build */
    isBuild?: boolean

    /** Is production mode */
    isProd?: boolean
}

type RunParamsFinal = {
    _isDevServer: boolean
    _isSelfDevelopment: boolean
} & Required<RunParams>


export type {
    ServerExtenderFn, ExpressExtenderParams, HTTP2ExtenderParams,
    Config, ConfigDefault, ConfigFinal,
    RunParams, RunParamsFinal
}