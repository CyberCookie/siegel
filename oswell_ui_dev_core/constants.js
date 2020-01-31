const join = require('path').join;

const devTools = join(__dirname, 'dev_tools')

const PATHS = {
    build: join(devTools, 'webpack.js'),
    staticServer: join(devTools, 'server', 'index.js'),
    uiCore: join(__dirname, 'ui_core'),
    nodeModules: join(__dirname, 'node_modules')
}


const DEFAULT_RUN_PARAMS = {
    isServer: true,
    isBuild: true,
    // isStorybook: false,
    isProd: true
}


module.exports = { PATHS, DEFAULT_RUN_PARAMS }