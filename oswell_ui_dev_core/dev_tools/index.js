process.on('warning', console.warn)
process.on('uncaughtException', console.error)

const CONSTANTS = require('../constants')


const main = async function (CONFIG = {}, RUN_PARAMS = CONSTANTS.DEFAULT_RUN_PARAMS) {
    RUN_PARAMS.isDevServer = !RUN_PARAMS.isProd && RUN_PARAMS.isServer;
    
    let  devMiddlewares = []
    if (RUN_PARAMS.isBuild) {
        const { run, getDevMiddlewares } = require(CONSTANTS.PATHS.build)
        const webpackCompiller = await run(CONFIG, RUN_PARAMS)
        
        if (RUN_PARAMS.isDevServer) {
            devMiddlewares = Object.values(getDevMiddlewares(CONFIG, webpackCompiller))
        }
    }
    
    
    if (RUN_PARAMS.isServer) {
        const { extenderLoc, watch } = CONFIG.server;

        const devServer = require(CONSTANTS.PATHS.staticServer)
        const initDevServer = extendExpressDevServer => devServer.run(CONFIG, devMiddlewares, extendExpressDevServer)


        if (extenderLoc) {
            function getCustomExpressExtender() {
                let userExtendExpressDevServer = require(extenderLoc).extendExpressDevServer; //TODO
                if (typeof userExtendExpressDevServer === 'function') {
                    return userExtendExpressDevServer;
                } else throw 'custom sever doesn\`t have required extendExpressDevServer method'
            }

            try {
                let extendExpressDevServer = getCustomExpressExtender()

                if (watch) {
                    let devServerInstance = initDevServer(extendExpressDevServer)
                    let lock = false;

                    require('fs')
                        .watch(extenderLoc)
                        .on('change', () => {
                            lock || (lock = setTimeout(() => {
                                delete require.cache[extenderLoc]
                                delete require.cache[CONSTANTS.PATHS.staticServer]

                                devServerInstance.close()
                                devServerInstance = initDevServer(getCustomExpressExtender())

                                lock = false
                            }, 100))
                        })
                }
            } catch(err) { console.error(err) }
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