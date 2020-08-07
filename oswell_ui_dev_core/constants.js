const join = require('path').join;

const devTools = join(__dirname, 'dev_tools')

const PATHS = {
    build: join(devTools, 'build', 'index.js'),
    staticServer: join(devTools, 'server', 'index.js'),
    uiCore: join(__dirname, 'ui_core'),
    nodeModules: join(__dirname, 'node_modules')
}


const DEFAULT_CONFIG = {
    server: {
        host: 'localhost',
        port: 3000
    },

    build: {
        aliases: {}
    }
}

const DEFAULT_RUN_PARAMS = {
    isServer: true,
    isBuild: true,
    isProd: false
}


module.exports = { PATHS, DEFAULT_RUN_PARAMS, DEFAULT_CONFIG }