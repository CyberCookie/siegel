import type { RunParams } from './types'
export {}

process.on('warning', console.warn)
process.on('uncaughtException', console.error)


const CONSTANTS                 = require('./constants')
const normalizeConfigs          = require('./normalize_configs')


async function main(_CONFIG?: any, _RUN_PARAMS?: RunParams) {
    const { CONFIG, RUN_PARAMS } = normalizeConfigs(_CONFIG, _RUN_PARAMS)

    const { isBuild, isDevServer, isServer } = RUN_PARAMS


    let devMiddlewares: any = []
    if (isBuild) {
        const { run, getDevMiddlewares } = require(CONSTANTS.PATHS.build)(CONFIG, RUN_PARAMS)
        await run()

        if (isDevServer) {
            devMiddlewares = Object.values(getDevMiddlewares())
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
            const { statSync, readdir, watch } = require('fs')
            const { join, dirname } = require('path')

            let lock: NodeJS.Timer = null
            let serverIndexFile: string
            let serverInstanceDir: string

            function clearCachedDependencies({ filename }: NodeJS.Module) {
                const cachedFile = require.cache[filename]

                if (cachedFile && filename.startsWith(serverInstanceDir)) {
                    const cacheChildren = cachedFile.children
                    delete require.cache[filename]

                    cacheChildren.forEach(clearCachedDependencies)
                }
            }

            function stopDevServerInstance() {
                const userModuleEntry = require.cache[serverIndexFile]
                userModuleEntry && clearCachedDependencies(userModuleEntry)

                devServerInstance.close()
                devServerInstance = createDevServer()

                lock = null
            }

            function onChange() {
                lock || (lock = setTimeout(stopDevServerInstance, 100))
            }

            function applyWatchListener(file: any, prefix?: any) {
                prefix && (file = join(prefix, file))

                if (statSync(file).isDirectory()) {
                    readdir(file, (err: any, files: any) => {
                        err
                            ?   console.error(err)
                            :   files.forEach((f: any) => { applyWatchListener(f, file) })
                    })
                } else {
                    serverIndexFile || (
                        serverIndexFile = file,
                        serverInstanceDir = dirname(file)
                    )
                    watch(file).on('change', onChange)
                }
            }

            applyWatchListener(appServerLoc)
        }
    }
}


if (require.main == module) main()
else {
    module.exports = main
    module.exports.proxyReq = require('./server/proxy')
    module.exports.buildConstants = require('./client_build/constants')
}