'use strict'

process.on('warning', console.warn)
process.on('uncaughtException', console.error)

import * as utils from './utils/index.js'
import normalizeConfigs from './normalize_configs.js'
import webpackBuilder, { BUILD_CONSTANTS } from './client_build/index.js'
import {
    bootServer, getStaticServingData, http2Server, httpServer, proxyReq,
    extractSSL
} from './server/index.js'


async function main(_CONFIG?: any, _RUN_PARAMS?: any, performConfigNormalize = true) {
    const normalized = performConfigNormalize && normalizeConfigs(_CONFIG, _RUN_PARAMS)
    const CONFIG = normalized ? normalized.CONFIG : _CONFIG
    const RUN_PARAMS = normalized ? normalized.RUN_PARAMS : _RUN_PARAMS

    const { isBuild, _isDevServer, isServer } = RUN_PARAMS


    let devMiddlewares: any = []
    if (isBuild) {
        const { run, getDevMiddlewares } = webpackBuilder(CONFIG, RUN_PARAMS)

        await run()

        if (_isDevServer) {
            devMiddlewares = Object.values(getDevMiddlewares())
        }
    }


    if (isServer) {
        let appServer
        const { appServerLoc } = CONFIG.server
        if (appServerLoc) {
            try {
                appServer = (await import(appServerLoc)).default

                if (!appServer || !(appServer instanceof Function || appServer instanceof Promise)) {
                    throw '[appServerLoc] export type is not a function'
                }
            } catch(err) { console.error(err) }
        }

        bootServer.run({ CONFIG, devMiddlewares, appServer })
    }
}

utils.isRunDirectly(import.meta) && main()


export default main
export {
    webpackBuilder, BUILD_CONSTANTS,
    bootServer, getStaticServingData, http2Server, httpServer, proxyReq,
    extractSSL,
    utils
}