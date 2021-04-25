const { join, relative, dirname } = require('path')


const {
    pluginInstancesKeyMap, pluginsKeysMap,

    COMMONS: { ESLintExtensions },

    DEPENDENCIES: {
        webpack,
        plugins: {
            HTMLPlugin, optimizeCSS, fileCopyPlugin, compressionPlugin, cleanPlugin, miniCssExtract, reactRefresh,
            serviceWorkerPlugin, eslint
        }
    }
} = require('../constants')


module.exports = (CONFIG, RUN_PARAMS) => {
    const { staticDir, build: { input } } = CONFIG
    const { isProd, isServer } = RUN_PARAMS


    const defaults = {
        // debug: { plugin: webpack.debug.ProfilingPlugin },

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
                    to: input.assetsDir && join(
                            staticDir,
                            relative(
                                dirname(input.html),
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
                chunkFilename: /*isDev ? '[id].css' : */'chunk.[contenthash].css'
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
            plugin: cleanPlugin.CleanWebpackPlugin
        },

        [pluginsKeysMap.reactRefresh]: {
            plugin: reactRefresh,
            enabled: !isProd
        },

        [pluginsKeysMap.eslint]: {
            plugin: eslint,
            enabled: true,
            options: {
                extensions: ESLintExtensions,
                emitWarning: true
            }
        }
    }


    return defaults
}