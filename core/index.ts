process.on('warning', console.warn)
process.on('uncaughtException', console.error)

const { INIT_CWD, PWD } = process.env
if (INIT_CWD && INIT_CWD !== PWD) {
    process.chdir(INIT_CWD)
}


import getConfig from './get_config.js'
import webpackBuilder from './client_build'
import { bootServer } from './server'

import type { Config, WebpackMiddlewares } from './types'



async function main(userConfig?: Config) {

    const config = getConfig(userConfig)
    const { isBuild, isServer, isProd } = config.runMode


    let devMiddlewares: Partial<WebpackMiddlewares> = {}
    if (isBuild) {
        const { run, getDevMiddlewares } = webpackBuilder(config)

        await run()

        if (isServer && !isProd) {
            devMiddlewares = getDevMiddlewares()
        }
    }


    isServer && bootServer.run({
        devMiddlewares: devMiddlewares as WebpackMiddlewares,
        config
    })
}

import.meta.main && main()



export default main
export { getConfig }
export * from './client_build'
export * from './server'
export * as utils from '../common'
export * as nodeUtils from './utils'

export type * from './types'
export type {
    ServerExtenderFn,
    FastifyHTTPServer, FastifyHTTPServerSecure, FastifyHTTP2Server, FastifyHTTP2ServerSecure
} from './types'