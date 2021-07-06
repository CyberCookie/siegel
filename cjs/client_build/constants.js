const resolve = require.resolve;
const DEPENDENCIES = {
    webpack: require('webpack'),
    devMiddleware: require('webpack-dev-middleware'),
    hotMiddleware: require('webpack-hot-middleware'),
    esBuildMinifyPlugin: require('esbuild-loader').ESBuildMinifyPlugin,
    plugins: {
        HTMLPlugin: require('html-webpack-plugin'),
        optimizeCSS: require('optimize-css-assets-webpack-plugin'),
        fileCopyPlugin: require('copy-webpack-plugin'),
        compressionPlugin: require('compression-webpack-plugin'),
        cleanPlugin: require('clean-webpack-plugin'),
        miniCssExtract: require('mini-css-extract-plugin'),
        reactRefresh: require('@pmmmwh/react-refresh-webpack-plugin'),
        eslint: require('eslint-webpack-plugin'),
        serviceWorkerPlugin: require('./plugins/plugin_sw')
    },
    loaders: {
        esbuild: resolve('esbuild-loader'),
        styleLoader: resolve('style-loader'),
        cssLoader: resolve('css-loader'),
        postCssLoader: resolve('postcss-loader'),
        sassLoader: resolve('sass-loader'),
        sassResourcesLoader: resolve('sass-resources-loader'),
        postCssAutoprefix: resolve('autoprefixer'),
        postCssSVG2Font: resolve('./modules/postcss_svg2icon_plugin')
    }
};
const COMMONS = {
    ESLintExtensions: ['.js', '.jsx', '.ts', '.tsx']
};
const loadersKeyMap = {
    esbuild: 'esbuild-loader',
    cssFinal: 'cssFinal',
    cssLoader: 'cssLoader',
    postCssLoader: 'postCssLoader',
    sassLoader: 'sassLoader',
    sassResources: 'sassResources'
};
const webpackModulesRegExp = {
    scripts: '[tj]sx?',
    styles: 's[ac]ss'
};
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
};
const pluginInstancesKeyMap = {
    compression_br: 'br',
    compression_gzip: 'gzip',
};
module.exports = { loadersKeyMap, pluginsKeysMap, pluginInstancesKeyMap, webpackModulesRegExp, DEPENDENCIES, COMMONS };
