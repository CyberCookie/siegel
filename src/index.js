process.on('warning', console.warn)
process.on('uncaughtException', console.error)


const CONSTANTS         = require('./constants')
const normalizeConfigs  = require('./normalize_configs')


const main = async function(_CONFIG, _RUN_PARAMS) {
    const { CONFIG, RUN_PARAMS } = normalizeConfigs(_CONFIG, _RUN_PARAMS)
    const { isBuild, isDevServer, isServer } = RUN_PARAMS;


    let devMiddlewares = []
    if (isBuild) {
        const { run, getDevMiddlewares } = require(CONSTANTS.PATHS.build)
        const webpackCompiller = await run(CONFIG, RUN_PARAMS)
        
        if (isDevServer) {
            devMiddlewares = Object.values(getDevMiddlewares(CONFIG, webpackCompiller))
        }
    }
    
    
    if (isServer) {
        const { appServerLoc, watch } = CONFIG.server;
        const devServerLoc = CONSTANTS.PATHS.staticServer;

        const devServer = require(devServerLoc)

        function createDevServer() {
            let appServer;
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
        if (appServerLoc && watch) {
            let lock = false;
            function reInitDevServer() {
                delete require.cache[appServerLoc]
                // delete require.cache[devServerLoc]

                devServerInstance.close()
                devServerInstance = createDevServer()

                lock = false
            }


            require('fs')
                .watch(appServerLoc)
                // .watch(devServerLoc)
                .on('change', () => {
                    lock || (lock = setTimeout(reInitDevServer, 100))
                })
        }
    }
}


module.parent
    ?   (module.exports = main)
    :   main()