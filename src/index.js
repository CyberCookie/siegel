'use strict'

import * as utils from './utils/index.js'
import proxyReq from './server/proxy.js'
import * as BUILD_CONSTANTS from './client_build/constants.js'
import { PATHS } from './constants.js'
import normalizeConfigs from './normalize_configs.js'


process.on('warning', console.warn)
process.on('uncaughtException', console.error)


async function main(_CONFIG, _RUN_PARAMS, performConfigNormalize = true) {
    const normalized = performConfigNormalize && normalizeConfigs(_CONFIG, _RUN_PARAMS)
    const CONFIG = normalized ? normalized.CONFIG : _CONFIG
    const RUN_PARAMS = normalized ? normalized.RUN_PARAMS : _RUN_PARAMS

    const { isBuild, _isDevServer, isServer } = RUN_PARAMS


    let devMiddlewares = []
    if (isBuild) {
        const builder = (await import(PATHS.build)).default
        const { run, getDevMiddlewares } = builder(CONFIG, RUN_PARAMS)

        await run()

        if (_isDevServer) {
            devMiddlewares = Object.values(getDevMiddlewares())
        }
    }


    if (isServer) {
        const devServer = (await import(PATHS.staticServer)).default

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

        devServer.run(CONFIG, devMiddlewares, appServer)
    }
}

utils.isRunDirectly(import.meta) && main()


export default main
export { BUILD_CONSTANTS, proxyReq, utils }