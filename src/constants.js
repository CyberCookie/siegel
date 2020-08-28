const join = require('path').join;

const root = join(__dirname, '..')

const PATHS = {
    root,
    example: join(root, '__example'),
    nodeModules: join(root, 'node_modules'),
    package: join(root, 'package.json'),
    build: join(__dirname, 'ui_build', 'index'),
    staticServer: join(__dirname, 'server', 'index'),
    uiCore: join(__dirname, 'ui_core')
}


const DEFAULT_CONFIG = {
    server: {
        host: 'localhost',
        port: 3000
    },

    build: {
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