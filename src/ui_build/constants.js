// const { PATHS } = require('../constants')


const loadersKeyMap = {
    babel: 'babel',
    eslint: 'eslint',
    cssFinal: 'cssFinal',
    cssLoader: 'cssLoader',
    postCssLoader: 'postCssLoader',
    sassLoader: 'sassLoader',
    sassResources: 'sassResources'
}

const webpackModulesRegExp = {
    scripts: '[tj]sx?',
    styles: 's[ac]ss'
}


const pluginsKeysMap = {
    compression: 'compression',
    copy: 'copy',
    cssExtract: 'cssExtract',
    sw: 'sw',
    cssOptimize: 'cssOptimize',
    hot: 'hot',
    html: 'html',
    clean: 'clean',
    reactRefresh: 'reactRefresh'
}

const pluginInstancesKeyMap = {
    compression_br: 'br',
    compression_gzip: 'gzip',
}

//TODO?
// const defaults = {
//     mode: 'development',
//     devtool: 'cheap-module-eval-source-map',
//     resolve_extensions: ['.js', '.jsx', '.ts', '.tsx', '.sass'],
//     resolve_modules: [ PATHS.nodeModules, PATHS.parentNodeModules ]
// }


module.exports = { loadersKeyMap, pluginsKeysMap, pluginInstancesKeyMap, webpackModulesRegExp/*, defaults*/ }