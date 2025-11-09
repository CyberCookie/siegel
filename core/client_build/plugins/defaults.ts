import path from 'path'

import isExists from '../../../common/is/exists'
import { COMMONS, DEPENDENCIES, pluginsKeysMap } from '../constants.js'

import type { Options as HTMLWebpackPluginOptions } from 'html-webpack-plugin'
import type { Options as EslintWebpackPluginOptions } from 'eslint-webpack-plugin'
import type { ConfigObject } from '../../types'
import type { CompressionInstanceCommonOptions, DefaultPlugins } from './types'


const {
    webpack,
    plugins: {
        HTMLPlugin, fileCopyPlugin, compressionPlugin, miniCssExtract, reactRefresh,
        serviceWorkerPlugin, eslint
    }
} = DEPENDENCIES

const { ESLintExtensions } = COMMONS


const resolvePluginDefaultOptions = <P extends Obj>(defaultOptions: Partial<P>, userOptions: any) => (
    typeof userOptions == 'object'
        ?   userOptions
        :   typeof userOptions == 'function'
            ?   userOptions(defaultOptions)
            :   defaultOptions
)


function getDefaultPluginsConfig(config: ConfigObject) {
    const { build, runMode, publicDir } = config
    const { isProd, isServer } = runMode!
    const { eslint: eslintOptions, input, output } = build!
    const outputFilenames = output!.filenames



    const compressionInstanceCommonOptions: CompressionInstanceCommonOptions = {
        test: /\.*$/,
        threshold: 10240,
        deleteOriginalAssets: false
    }

    const defaults: DefaultPlugins = {
        [ pluginsKeysMap.compression ]: {
            plugin: compressionPlugin,
            enabled: isProd!,
            instances: {
                br: {
                    options: {
                        ...compressionInstanceCommonOptions,
                        filename: outputFilenames!.brotli!,
                        algorithm: 'brotliCompress',
                        compressionOptions: {
                            level: 11
                        }
                    }
                },
                gzip: {
                    options: {
                        ...compressionInstanceCommonOptions,
                        filename: outputFilenames!.gzip!
                    }
                }
            }
        },

        [ pluginsKeysMap.copy ]: {
            plugin: fileCopyPlugin,
            enabled: !!input!.copyFiles,
            options: {
                patterns:
                    typeof input!.copyFiles == 'string'
                        ?   [{
                                from: input!.copyFiles,
                                to: path.join(
                                        publicDir!,
                                        path.relative(
                                            path.dirname(
                                                isExists((input!.html as HTMLWebpackPluginOptions).template)
                                                ||  typeof input!.html == 'string'
                                                    ?   typeof input!.html == 'string'
                                                        ?   input!.html
                                                        :   (input!.html as HTMLWebpackPluginOptions).template!
                                                    :   input!.js!
                                            ),
                                            input!.copyFiles
                                        )
                                    )
                            }]
                        :   input!.copyFiles!
            }
        },

        [ pluginsKeysMap.sw ]: {
            plugin: serviceWorkerPlugin,
            enabled: !!input!.sw,
            options: input!.sw!
        },

        [ pluginsKeysMap.cssExtract ]: {
            plugin: miniCssExtract,
            enabled: isProd || !isServer,
            options: {
                experimentalUseImportModule: true,
                filename: outputFilenames!.styles!,
                chunkFilename: outputFilenames!.styles_chunk!
            }
        },

        [ pluginsKeysMap.html ]: {
            plugin: HTMLPlugin,
            enabled: !!input!.html,
            options: resolvePluginDefaultOptions<HTMLWebpackPluginOptions>({
                // scriptLoading: 'defer',
                template: input!.html as NonNullable<HTMLWebpackPluginOptions['template']>,
                minify: {
                    collapseWhitespace: true
                }
            }, input!.html)
        },

        [ pluginsKeysMap.hot ]: {
            plugin: webpack.HotModuleReplacementPlugin,
            enabled: !isProd
        },

        [ pluginsKeysMap.reactRefresh ]: {
            plugin: reactRefresh,
            enabled: !isProd,
            options: {
                overlay: {
                    sockIntegration: 'whm'
                }
            }
        },

        [ pluginsKeysMap.eslint ]: {
            plugin: eslint,
            enabled: !!eslintOptions,
            options: resolvePluginDefaultOptions<EslintWebpackPluginOptions>({
                extensions: ESLintExtensions as unknown as string[],
                emitWarning: true,
                configType: 'flat',
                failOnError: false
            }, eslintOptions)
        }
    }


    return defaults
}


export default getDefaultPluginsConfig