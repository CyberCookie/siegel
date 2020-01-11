const join = require('path').join;


const PATHS = {
    build: join(__dirname, 'dev_tools', 'webpack.js'),
    staticServer: join(__dirname, 'dev_tools', 'server', 'index.js'),
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