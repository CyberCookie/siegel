import { dirname, join, relative } from 'path'

import {
    pluginInstancesKeyMap, pluginsKeysMap, COMMONS, DEPENDENCIES
} from '../constants.js'


const {
    webpack,
    plugins: {
        HTMLPlugin, optimizeCSS, fileCopyPlugin, compressionPlugin, miniCssExtract, reactRefresh,
        serviceWorkerPlugin, eslint
    }
} = DEPENDENCIES

const { ESLintExtensions } = COMMONS


function resolvePluginDefaultOptions(defaultOptions: any, userOptions: any) {
    const typeofUserOptions = typeof userOptions

    return typeofUserOptions == 'object'
        ?   userOptions
        :   typeofUserOptions == 'function'
            ?   userOptions(defaultOptions)
            :   defaultOptions
}


function getDefaultPluginsConfig(CONFIG: any, RUN_PARAMS: any) {
    const {
        eslint: eslintOptions,
        output: {
            filenames: outputFilenames
        },
        input
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
                        filename: outputFilenames.brotli,
                        algorithm: 'brotliCompress',
                        compressionOptions: {
                            level: 11
                        }
                    })
                },
                [ pluginInstancesKeyMap.compression_gzip ]: {
                    options: Object.assign({}, compressionInstanceCommonOptions, {
                        filename: outputFilenames.gzip
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
                                CONFIG.publicDir,
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
                filename: outputFilenames.styles,
                chunkFilename: outputFilenames.styles_chunk
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
                    collapseWhitespace: true
                }
            }, input.html)
        },

        [ pluginsKeysMap.hot ]: {
            plugin: webpack.HotModuleReplacementPlugin,
            enabled: !isProd
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
                // ,fix: true
            }, eslintOptions)
        }
    }


    return defaults
}


export default getDefaultPluginsConfig