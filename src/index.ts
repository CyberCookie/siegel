import type { RunParams } from './types'
export {}

process.on('warning', console.warn)
process.on('uncaughtException', console.error)


const CONSTANTS         = require('./constants')
const normalizeConfigs  = require('./normalize_configs')


async function main(_CONFIG?: any, _RUN_PARAMS?: RunParams) {
    const { CONFIG, RUN_PARAMS } = normalizeConfigs(_CONFIG, _RUN_PARAMS)
    const { isBuild, isDevServer, isServer } = RUN_PARAMS


    let devMiddlewares: any = []
    if (isBuild) {
        const { run, getDevMiddlewares } = require(CONSTANTS.PATHS.build)
        const webpackCompiller = await run(CONFIG, RUN_PARAMS)

        if (isDevServer) {
            devMiddlewares = Object.values(getDevMiddlewares(CONFIG, webpackCompiller))
        }
    }


    if (isServer) {
        const { appServerLoc, watch } = CONFIG.server
        const devServerLoc = CONSTANTS.PATHS.staticServer

        const devServer = require(devServerLoc)

        function createDevServer() {
            let appServer
            if (appServerLoc) {
                try {
                    appServer = require(appServerLoc)

                    if (typeof appServer != 'function') {
                        throw '[appServerLoc] export type is not a function'
                    }
                } catch(err) { console.error(err) }
            }

            return devServer.run(CONFIG, devMiddlewares, appServer)
        }

        let devServerInstance = createDevServer()
        if (watch && appServerLoc) {
            const fs = require('fs')
            const { join } = require('path').posix

            let lock: any = false
            let serverIndexFile: any

            function clearCachedDependencies({ filename }: any) {
                const cacheChildren = require.cache[filename]!.children
                delete require.cache[filename]

                cacheChildren.forEach(clearCachedDependencies)
            }

            function stopDevServerInstance() {
                clearCachedDependencies({ filename: serverIndexFile })

                devServerInstance.close()
                devServerInstance = createDevServer()

                lock = false
            }

            function onChange() {
                lock || (lock = setTimeout(stopDevServerInstance, 100))
            }

            function applyWatchListener(file: any, prefix?: any) {
                prefix && (file = join(prefix, file))

                if (fs.statSync(file).isDirectory()) {
                    fs.readdir(file, (err: any, files: any) => {
                        err
                            ?   console.error(err)
                            :   files.forEach((f: any) => { applyWatchListener(f, file) })
                    })
                } else {
                    serverIndexFile || (serverIndexFile = file)
                    fs.watch(file).on('change', onChange)
                }
            }

            applyWatchListener(appServerLoc)
        }
    }
}


require.main == module
    ?   main()
    :   (module.exports = main)