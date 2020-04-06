process.on('warning', console.warn)
process.on('uncaughtException', console.error)

const CONSTANTS = require('../constants')


const main = async function (CONFIG = {}, RUN_PARAMS = CONSTANTS.DEFAULT_RUN_PARAMS) {
    RUN_PARAMS.isDevServer = !RUN_PARAMS.isProd && RUN_PARAMS.isServer;
    
    let devMiddlewares = []
    if (RUN_PARAMS.isBuild) {
        const { run, getDevMiddlewares } = require(CONSTANTS.PATHS.build)
        const webpackCompiller = await run(CONFIG, RUN_PARAMS)
        
        if (RUN_PARAMS.isDevServer) {
            devMiddlewares = Object.values(getDevMiddlewares(CONFIG, webpackCompiller))
        }
    }
    
    
    if (RUN_PARAMS.isServer) {
        const { extenderLoc, watch } = CONFIG.server;
        const devServerLoc = CONSTANTS.PATHS.staticServer;

        const devServer = require(devServerLoc)
        const initDevServer = extendExpressDevServer => devServer.run(CONFIG, devMiddlewares, extendExpressDevServer)

        
        if (extenderLoc) {
            function getCustomExpressExtender() {
                try {
                    const userExtendExpressDevServer = require(extenderLoc)
                    if (typeof userExtendExpressDevServer === 'function') {
                        return userExtendExpressDevServer;
                    } else throw '[extenderLoc] export type is not a function'
                } catch(err) { console.error(err) }
            }
            
            const extendExpressDevServer = getCustomExpressExtender()
            let devServerInstance = initDevServer(extendExpressDevServer)

            if (watch) {
                let lock = false;

                require('fs')
                    .watch(extenderLoc)
                    // .watch(devServerLoc)
                    .on('change', () => {
                        lock || (lock = setTimeout(() => {
                            delete require.cache[extenderLoc]
                            // delete require.cache[devServerLoc]

                            devServerInstance.close()
                            devServerInstance = initDevServer(getCustomExpressExtender())

                            lock = false
                        }, 100))
                    })
            }
        } else {
            initDevServer()
        }
    }
    
    
    // if (RUN_PARAMS.isStorybook) {
        // require('@storybook/react/standalone')
        //     ({
        //         mode: 'dev',
        //         port: 9010,
        //         configDir: path.join('src', 'core', '.dev', 'stories')
        //     })
        //     .then(console.log)
        //     .catch(console.error)
    // }
}


module.parent
    ?   (module.exports = main)
    :   main()