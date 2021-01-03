type Config = {
    staticDir: string
    server?: {
        host: string
        port: number
    }
}


type RunParams = {
    isServer?: boolean
    isBuild?: boolean
    isProd?: boolean
}


export type { Config, RunParams }