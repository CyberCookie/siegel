const join = require('path').join;

const PATHS = {
    build: join(__dirname, 'ui_build', 'index.js'),
    staticServer: join(__dirname, 'server', 'index.js'),
    uiCore: join(__dirname, 'ui_core'),
    nodeModules: join(__dirname, 'node_modules'),
    example: join(__dirname, '__example'),
    root: __dirname
}


const DEFAULT_CONFIG = {
    server: {
        host: 'localhost',
        port: 3000
    },

    build: {
        aliases: {},
        input: {
            html: join(PATHS.example, 'client', 'index.html'),
            assetsDir: ''
        }
    }
}

const DEFAULT_RUN_PARAMS = {
    isServer: true,
    isBuild: true,
    isProd: false
}


module.exports = { PATHS, DEFAULT_RUN_PARAMS, DEFAULT_CONFIG }