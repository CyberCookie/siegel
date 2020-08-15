process.on('warning', console.warn)
process.on('uncaughtException', console.error)


const CONSTANTS = require('./constants')
const normalizeConfigs = require('./normalize_configs')


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
        const { extenderLoc, watch } = CONFIG.server;
        const devServerLoc = CONSTANTS.PATHS.staticServer;

        const devServer = require(devServerLoc)

        function initDevServer() {
            let extender;
            if (extenderLoc) {
                try {
                    const _extender = require(extenderLoc)

                    if (typeof _extender == 'function') extender = _extender;
                    else throw '[extenderLoc] export type is not a function'
                } catch(err) { console.error(err) }
            }

            return devServer.run(CONFIG, devMiddlewares, extender)
        }

        
        let devServerInstance = initDevServer()
        if (watch) {
            let lock = false;
            function reInitDevServer() {
                delete require.cache[extenderLoc]
                // delete require.cache[devServerLoc]

                devServerInstance.close()
                devServerInstance = initDevServer()

                lock = false
            }


            require('fs')
                .watch(extenderLoc)
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