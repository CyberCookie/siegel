process.on('warning', console.warn)
process.on('uncaughtException', console.error)

const { INIT_CWD, PWD } = process.env
if (INIT_CWD && INIT_CWD != PWD) {
    process.chdir(INIT_CWD)
}


import * as utils from '../common'
import * as nodeUtils from './utils'
import getConfig from './get_config.js'
import webpackBuilder, { BUILD_CONSTANTS } from './client_build'
import { bootServer, getStaticServingData, extractSSL, proxyReq } from './server'

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

nodeUtils.isRunDirectly(import.meta) && main()


export default main
export {
    webpackBuilder, BUILD_CONSTANTS, getConfig,
    bootServer, getStaticServingData, extractSSL,
    nodeUtils, utils, proxyReq
}
export type { Config, WebpackMiddlewares }
export type {
    ServerExtenderFn,
    FastifyHTTPServer, FastifyHTTPServerSecure, FastifyHTTP2Server, FastifyHTTP2ServerSecure
} from './types'