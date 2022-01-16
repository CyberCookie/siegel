'use strict'

import dirname from './utils/__dirname.js'
import isRunDirectly from './utils/is_run_directly.js'
import proxyReq from './server/proxy.js'
import * as BUILD_CONSTANTS from './client_build/constants.js'
import { PATHS } from './constants.js'
import normalizeConfigs from './normalize_configs.js'


process.on('warning', console.warn)
process.on('uncaughtException', console.error)


async function main(_CONFIG, _RUN_PARAMS) {
    const { CONFIG, RUN_PARAMS } = normalizeConfigs(_CONFIG, _RUN_PARAMS)

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

                if (appServer.constructor != Function) {
                    throw '[appServerLoc] export type is not a function'
                }
            } catch(err) { console.error(err) }
        }

        devServer.run(CONFIG, devMiddlewares, appServer)
    }
}

isRunDirectly(import.meta) && main()


export default main
export { BUILD_CONSTANTS, proxyReq, dirname, isRunDirectly }