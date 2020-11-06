const path                  = require('path')
const webpack               = require('webpack')
const HTMLPlugin            = require('html-webpack-plugin')
const optimizeCSS           = require('optimize-css-assets-webpack-plugin')
const fileCopyPlugin        = require('copy-webpack-plugin')
const compressionPlugin     = require('compression-webpack-plugin')
const cleanPlugin           = require('clean-webpack-plugin').CleanWebpackPlugin;
const miniCssExtract        = require('mini-css-extract-plugin')
const reactRefresh          = require('@pmmmwh/react-refresh-webpack-plugin')
const serviceWorkerPlugin   = require('./plugin_sw')

const { pluginInstancesKeyMap, pluginsKeysMap } = require('../constants')


module.exports = (CONFIG, RUN_PARAMS) => {
    const { staticDir, build: { input } } = CONFIG;
    const { isProd, isServer } = RUN_PARAMS;


    const defaults = {
        [pluginsKeysMap.compression]: {
            plugin: compressionPlugin,
            instances: {
                [pluginInstancesKeyMap.compression_br]: {
                    enabled: isProd,
                    options: {
                        test: /\.*$/,
                        filename: '[path].br[query]',
                        algorithm: 'brotliCompress',
                        compressionOptions: {
                            level: 11
                        },
                        threshold: 10240,
                        deleteOriginalAssets: false
                    }
                },
                [pluginInstancesKeyMap.compression_gzip]: {
                    enabled: isProd,
                    options: {
                        test: /\.*$/,
                        filename: '[path].gz[query]',
                        threshold: 10240,
                        deleteOriginalAssets: false
                    }
                }
            }
        },

        [pluginsKeysMap.copy]: {
            plugin: fileCopyPlugin,
            enabled: input.assetsDir,
            options: {
                patterns: [{
                    from: input.assetsDir,
                    to: input.assetsDir && path.join(
                            staticDir,
                            path.relative(
                                path.dirname(input.html),
                                input.assetsDir
                            )
                        )
                }]
            }
        },

        [pluginsKeysMap.sw]: {
            plugin: serviceWorkerPlugin,
            enabled: input.sw,
            options: input.sw
        },

        [pluginsKeysMap.cssExtract]: {
            plugin: miniCssExtract,
            enabled: isProd || !isServer,
            options: {
                filename: /*isDev ? 'styles.css' : */'styles.[contenthash].css',
                chunkFilename: /*isDev ? '[id].css' : */'[id].[contenthash].css'
            }
        },

        [pluginsKeysMap.cssOptimize]: {
            plugin: optimizeCSS,
            enabled: isProd,
        },

        [pluginsKeysMap.html]: {
            plugin: HTMLPlugin,
            enabled: input.html,
            options: {
                template: input.html,
                // scriptLoading: 'defer',
                minify: {
                    collapseWhitespace: true,
                }
            }
        },
        
        [pluginsKeysMap.hot]: {
            plugin: webpack.HotModuleReplacementPlugin,
            enabled: !isProd
        },

        [pluginsKeysMap.clean]: {
            plugin: cleanPlugin,
            enabled: true
        },

        [pluginsKeysMap.reactRefresh]: {
            plugin: reactRefresh,
            enabled: !isProd
        }
    }


    return defaults
}