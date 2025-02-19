process.on('warning', console.warn)
process.on('uncaughtException', console.error)

import * as utils from '../common'
import * as nodeUtils from './utils'
import normalizeConfigs from './normalize_configs.js'
import webpackBuilder, { BUILD_CONSTANTS } from './client_build'
import {
    bootServer, getStaticServingData, http2Server, httpServer, proxyReq,
    extractSSL
} from './server'

import type { RequestHandler } from 'express'
import type {
    ConfigFinal, Config, ConfigDefault,
    RunParamsFinal, RunParams,
    ServerExtenderFn, ExpressExtenderParams, HTTP2ExtenderParams
} from './types'


async function main(
    CONFIG?: ConfigFinal | Config,
    RUN_PARAMS?: RunParams
) {

    ({ CONFIG, RUN_PARAMS } = normalizeConfigs(CONFIG as Config, RUN_PARAMS))
    const { isBuild, _isDevServer, isServer } = RUN_PARAMS as RunParamsFinal


    let devMiddlewares: RequestHandler[] = []
    if (isBuild) {
        const { run, getDevMiddlewares } = webpackBuilder(
            CONFIG as ConfigFinal,
            RUN_PARAMS as RunParamsFinal
        )

        await run()

        if (_isDevServer) {
            devMiddlewares = Object.values(getDevMiddlewares())
        }
    }


    isServer && bootServer.run({
        devMiddlewares,
        CONFIG: CONFIG as ConfigFinal
    })
}

nodeUtils.isRunDirectly(import.meta) && main()


export default main
export {
    normalizeConfigs,
    webpackBuilder, BUILD_CONSTANTS,
    bootServer, getStaticServingData, http2Server, httpServer, proxyReq, extractSSL,
    nodeUtils, utils
}
export type {
    Config, ConfigDefault, RunParams,
    ServerExtenderFn, ExpressExtenderParams, HTTP2ExtenderParams
}