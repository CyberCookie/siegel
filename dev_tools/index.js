process.on('warning', console.warn)
process.on('uncaughtException', console.error)


const RUN_ARGUMENTS = process.argv;
const RUN_PARAMS = {
    isServer: RUN_ARGUMENTS.includes('-s'),
    isBuild: RUN_ARGUMENTS.includes('-b'),
    isStorybook: RUN_ARGUMENTS.includes('-sb'),
    isProd: process.env.NODE_ENV == 'production'
}
RUN_PARAMS.isDevServer = !RUN_PARAMS.isProd && RUN_PARAMS.isServer;



(async function () {
    let  devMiddlewares = []
    if (RUN_PARAMS.isBuild) {
        const { run, getDevMiddlewares } = require('./webpack')
        const webpackCompiller = await run(RUN_PARAMS)
        
        if (RUN_PARAMS.isDevServer) {
            devMiddlewares = Object.values(getDevMiddlewares(webpackCompiller))
        }
    }
    
    
    if (RUN_PARAMS.isServer) {
        const SERVER_LOC = require('path').join(process.cwd(), 'server', 'index.js')
        const { customServerLoc, watch } = require('./config').server;

        const devServer = require(SERVER_LOC)
        const initDevServer = extendExpressDevServer => devServer.run(devMiddlewares, extendExpressDevServer)


        if (customServerLoc) {
            function getCustomExpressExtender() {
                let userExtendExpressDevServer = require(customServerLoc).extendExpressDevServer;
                if (userExtendExpressDevServer instanceof Function) {
                    return userExtendExpressDevServer;
                } else throw 'custom sever doesn\`t have required extendExpressDevServer method'
            }

            try {
                let extendExpressDevServer = getCustomExpressExtender()

                if (watch) {
                    let devServerInstance = initDevServer(extendExpressDevServer)
                    let lock = false;

                    require('fs')
                        .watch(customServerLoc)
                        .on('change', () => {
                            lock || (lock = setTimeout(() => {
                                delete require.cache[customServerLoc]
                                delete require.cache[SERVER_LOC]

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
    
    
    if (RUN_PARAMS.isStorybook) {
        // require('@storybook/react/standalone')
        //     ({
        //         mode: 'dev',
        //         port: 9010,
        //         configDir: path.join('src', 'core', '.dev', 'stories')
        //     })
        //     .then(console.log)
        //     .catch(console.error)
    }
})()