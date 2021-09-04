const { dirname, posix } = require('path')
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


const { join, relative } = posix

function resolvePluginDefaultOptions(defaultOptions, userOptions) {
    const typeofUserOptions = typeof userOptions

    return typeofUserOptions == 'object'
        ?   userOptions
        :   typeofUserOptions == 'function'
            ?   userOptions(defaultOptions)
            :   defaultOptions
}


module.exports = (CONFIG, RUN_PARAMS) => {
    const {
        input,
        eslint: eslintOptions
    } = CONFIG.build
    const { isProd, isServer } = RUN_PARAMS



    const compressionInstanceCommonOptions = {
        test: /\.*$/,
        threshold: 10240,
        deleteOriginalAssets: false
    }

    const defaults = {
        [ pluginsKeysMap.compression ]: {
            plugin: compressionPlugin,
            enabled: isProd,
            instances: {
                [ pluginInstancesKeyMap.compression_br ]: {
                    options: Object.assign({}, compressionInstanceCommonOptions, {
                        filename: '[name].br[query]',
                        algorithm: 'brotliCompress',
                        compressionOptions: {
                            level: 11
                        }
                    })
                },
                [ pluginInstancesKeyMap.compression_gzip ]: {
                    options: Object.assign({}, compressionInstanceCommonOptions, {
                        filename: '[name].gz[query]'
                    })
                }
            }
        },

        [ pluginsKeysMap.copy ]: {
            plugin: fileCopyPlugin,
            enabled: !!input.copyFiles,
            options: {
                patterns: typeof input.copyFiles == 'string'
                    ?   [{
                            from: input.copyFiles,
                            to: join(
                                CONFIG.staticDir,
                                relative(
                                    dirname(input.html),
                                    input.copyFiles
                                )
                            )
                        }]
                    :   input.copyFiles
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
                experimentalUseImportModule: true,
                filename: isProd ? 'styles.[contenthash].css' : 'styles.[id].css',
                chunkFilename: isProd ? 'chunk.[contenthash].css' : 'chunk.[id].css'
            }
        },

        [ pluginsKeysMap.cssOptimize ]: {
            plugin: optimizeCSS,
            enabled: isProd
        },

        [ pluginsKeysMap.html ]: {
            plugin: HTMLPlugin,
            enabled: !!input.html,
            options: resolvePluginDefaultOptions({
                // scriptLoading: 'defer',
                template: input.html,
                minify: {
                    collapseWhitespace: true,
                }
            }, input.html)
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
            enabled: eslintOptions,
            options: resolvePluginDefaultOptions({
                extensions: ESLintExtensions,
                emitWarning: true
            }, eslintOptions)
        }
    }


    return defaults
}
export {}