const resolve = require.resolve;

const DEPENDENCIES = {
    webpack:        require('webpack'),
    devMiddleware:  require('webpack-dev-middleware'),
    hotMiddleware:  require('webpack-hot-middleware'),
    terserPlugin:   require('terser-webpack-plugin'),

    plugins: {
        HTMLPlugin:             require('html-webpack-plugin'),
        optimizeCSS:            require('optimize-css-assets-webpack-plugin'),
        fileCopyPlugin:         require('copy-webpack-plugin'),
        compressionPlugin:      require('compression-webpack-plugin'),
        cleanPlugin:            require('clean-webpack-plugin'),
        miniCssExtract:         require('mini-css-extract-plugin'),
        reactRefresh:           require('@pmmmwh/react-refresh-webpack-plugin'),
        eslint:                 require('eslint-webpack-plugin'),
        serviceWorkerPlugin:    require('./plugins/plugin_sw')
    },

    resolvedLoaders: {
        babelPresetEnv:                 resolve('@babel/preset-env'),
        babelPresetReact:               resolve('@babel/preset-react'),
        babelPresetTS:                  resolve('@babel/preset-typescript'),
        babelPluginReactRefresh:        resolve('react-refresh/babel'),
        babelPluginExportDefault:       resolve('@babel/plugin-proposal-export-default-from'),
        babelPluginExportNamespace:     resolve('@babel/plugin-proposal-export-namespace-from'),
        babelPluginDynamicImport:       resolve('@babel/plugin-syntax-dynamic-import'),
        babelPluginTransformRuntime:    resolve('@babel/plugin-transform-runtime'),
        babelPluginLogicalAssignment:   resolve('@babel/plugin-proposal-logical-assignment-operators'),
        babelPluginOptionalChaining:    resolve('@babel/plugin-proposal-optional-chaining'),
        postCssAutoprefix:              resolve('autoprefixer'),
        postCssSVG2Font:                resolve('./modules/postcss_svg2icon_plugin')
    }
}


const loadersKeyMap = {
    babel: 'babel',
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
    reactRefresh: 'reactRefresh',
    eslint: 'eslint'
}

const pluginInstancesKeyMap = {
    compression_br: 'br',
    compression_gzip: 'gzip',
}



module.exports = { loadersKeyMap, pluginsKeysMap, pluginInstancesKeyMap, webpackModulesRegExp, DEPENDENCIES }