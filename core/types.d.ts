import type { BuildConfig, BuildConfigDefault, BuildConfigFinal } from './client_build/types'
import type {
    ServerConfig, ServerConfigDefault, ServerConfigFinal,
    ServerExtenderFn
} from './server/types'


type Config = {
    publicDir?: string
    build?: BuildConfig
    server?: ServerConfig
} | string

type ConfigDefault = {
    publicDir: NonNullable<Config['publicDir']>
    build: BuildConfigDefault
    server: ServerConfigDefault
}

type ConfigFinal = {
    publicDir: NonNullable<Config['publicDir']>
    server: ServerConfigFinal
    build: BuildConfigFinal
}


type RunParams = {
    isServer?: boolean
    isBuild?: boolean
    isProd?: boolean
}

type RunParamsFinal = {
    _isDevServer: boolean
    _isSelfDevelopment: boolean
} & Required<RunParams>


export type {
    ServerExtenderFn,
    Config, ConfigDefault, ConfigFinal,
    RunParams, RunParamsFinal
}