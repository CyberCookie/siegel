process.on('warning', console.log)
process.on('uncaughtException', console.log)

const config = require('./config')

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
        const { run, getDevMiddlewares } = require(config.build.loc)
        const webpackCompiller = await run(RUN_PARAMS)

        if (RUN_PARAMS.isDevServer) {
            devMiddlewares = Object.values(getDevMiddlewares(webpackCompiller))
        }
    }
    

    if (RUN_PARAMS.isServer) {
        const serverLocation = config.server.loc;
        const initServer = () => require(serverLocation).run(devMiddlewares)
        
    
        let server = initServer()
        let lock = false;
    
        function onServerFileChange() {
            lock || (lock = setTimeout(() => {
                server.close()
                delete require.cache[serverLocation]
        
                server = initServer()
                lock = false
            }, 100))
        }
    
        require('fs')
            .watch(serverLocation)
            .on('change', onServerFileChange)
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