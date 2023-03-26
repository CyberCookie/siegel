import path from 'path'

import isExists from '../../../common/is/exists'
import { COMMONS, DEPENDENCIES, pluginsKeysMap } from '../constants.js'

import type { Options as HTMLWebpackPluginOptions } from 'html-webpack-plugin'
import type { ConfigFinal, RunParamsFinal } from '../../types'
import type {
    CompressionInstanceCommonOptions, ResolvePluginDefaultOptions, DefaultPlugins
} from './types'


const {
    webpack,
    plugins: {
        HTMLPlugin, fileCopyPlugin, compressionPlugin, miniCssExtract, reactRefresh,
        serviceWorkerPlugin, eslint
    }
} = DEPENDENCIES

const { ESLintExtensions } = COMMONS


const resolvePluginDefaultOptions: ResolvePluginDefaultOptions = (defaultOptions, userOptions) => {
    const typeofUserOptions = typeof userOptions

    return typeofUserOptions == 'object'
        ?   userOptions
        :   typeofUserOptions == 'function'
            ?   userOptions(defaultOptions)
            :   defaultOptions
}


function getDefaultPluginsConfig(CONFIG: ConfigFinal, RUN_PARAMS: RunParamsFinal) {
    const {
        eslint: eslintOptions,
        output: {
            filenames: outputFilenames
        },
        input
    } = CONFIG.build
    const { isProd, isServer } = RUN_PARAMS



    const compressionInstanceCommonOptions: CompressionInstanceCommonOptions = {
        test: /\.*$/,
        threshold: 10240,
        deleteOriginalAssets: false
    }

    const defaults: DefaultPlugins = {
        [ pluginsKeysMap.compression ]: {
            plugin: compressionPlugin,
            enabled: isProd,
            instances: {
                br: {
                    options: {
                        ...compressionInstanceCommonOptions,
                        filename: outputFilenames.brotli!,
                        algorithm: 'brotliCompress',
                        compressionOptions: {
                            level: 11
                        }
                    }
                },
                gzip: {
                    options: {
                        ...compressionInstanceCommonOptions,
                        filename: outputFilenames.gzip!
                    }
                }
            }
        },

        [ pluginsKeysMap.copy ]: {
            plugin: fileCopyPlugin,
            enabled: !!input.copyFiles,
            options: {
                patterns:
                    typeof input.copyFiles == 'string'
                    && (isExists((input.html as HTMLWebpackPluginOptions).template) || typeof input.html == 'string')
                        ?   [{
                                from: input.copyFiles,
                                to: path.join(
                                        CONFIG.publicDir,
                                        path.relative(
                                            path.dirname(
                                                typeof input.html == 'string'
                                                    ?   input.html
                                                    :   (input.html as HTMLWebpackPluginOptions).template!
                                            ),
                                            input.copyFiles
                                        )
                                    )
                            }]
                        :   input.copyFiles!
            }
        },

        [ pluginsKeysMap.sw ]: {
            plugin: serviceWorkerPlugin,
            enabled: !!input.sw,
            options: input.sw!
        },

        [ pluginsKeysMap.cssExtract ]: {
            plugin: miniCssExtract,
            enabled: isProd || !isServer,
            options: {
                experimentalUseImportModule: true,
                filename: outputFilenames.styles!,
                chunkFilename: outputFilenames.styles_chunk!
            }
        },

        [ pluginsKeysMap.html ]: {
            plugin: HTMLPlugin,
            enabled: !!input.html,
            options: resolvePluginDefaultOptions({
                // scriptLoading: 'defer',
                template: input.html as NonNullable<HTMLWebpackPluginOptions['template']>,
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
            }, eslintOptions)
        }
    }


    return defaults
}


export default getDefaultPluginsConfig