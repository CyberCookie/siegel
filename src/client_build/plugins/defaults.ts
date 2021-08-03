const {
    pluginInstancesKeyMap, pluginsKeysMap,

    COMMONS: { ESLintExtensions },

    DEPENDENCIES: {
        webpack,
        plugins: {
            HTMLPlugin, optimizeCSS, fileCopyPlugin, compressionPlugin, miniCssExtract, reactRefresh,
            serviceWorkerPlugin, eslint, cleanPlugin
        }
    }
} = require('../constants')


module.exports = (CONFIG, RUN_PARAMS) => {
    const {
        input,
        eslint: eslintEnabled
    } = CONFIG.build
    const { isProd, isServer } = RUN_PARAMS


    const defaults = {
        [ pluginsKeysMap.compression ]: {
            plugin: compressionPlugin,
            enabled: isProd,
            instances: {
                [ pluginInstancesKeyMap.compression_br ]: {
                    options: {
                        test: /\.*$/,
                        filename: '[name].br[query]',
                        algorithm: 'brotliCompress',
                        compressionOptions: {
                            level: 11
                        },
                        threshold: 10240,
                        deleteOriginalAssets: false
                    }
                },
                [ pluginInstancesKeyMap.compression_gzip ]: {
                    options: {
                        test: /\.*$/,
                        filename: '[name].gz[query]',
                        threshold: 10240,
                        deleteOriginalAssets: false
                    }
                }
            }
        },

        [ pluginsKeysMap.copy ]: {
            plugin: fileCopyPlugin,
            enabled: !!input.copyFiles,
            options: {
                patterns: input.copyFiles
            }
        },

        [ pluginsKeysMap.sw ]: {
            plugin: serviceWorkerPlugin,
            enabled: !!input.sw,
            options: input.sw
        },

        [ pluginsKeysMap.cssExtract ]: {
            plugin: miniCssExtract,
            enabled: isProd || !isServer,
            options: {
                filename: isProd ? 'styles.[contenthash].css' : 'styles.[id].css',
                chunkFilename: isProd ? 'chunk.[contenthash].css' : 'chunk.[id].css'
            }
        },

        [ pluginsKeysMap.cssOptimize ]: {
            plugin: optimizeCSS,
            enabled: isProd,
        },

        [ pluginsKeysMap.html ]: {
            plugin: HTMLPlugin,
            enabled: !!input.html,
            options: {
                template: input.html,
                // scriptLoading: 'defer',
                minify: {
                    collapseWhitespace: true,
                }
            }
        },

        [ pluginsKeysMap.hot ]: {
            plugin: webpack.HotModuleReplacementPlugin,
            enabled: !isProd
        },

        [ pluginsKeysMap.clean ]: {
            plugin: cleanPlugin.CleanWebpackPlugin
        },

        [ pluginsKeysMap.reactRefresh ]: {
            plugin: reactRefresh,
            enabled: !isProd
        },

        [ pluginsKeysMap.eslint ]: {
            plugin: eslint,
            enabled: eslintEnabled,
            options: {
                extensions: ESLintExtensions,
                emitWarning: true
            }
        }
    }


    return defaults
}
export {}