import path from 'path'

import isExists from '../../../common/is/exists'
import { COMMONS, DEPENDENCIES, pluginsKeysMap } from '../constants.js'

import type {
    BasePluginOptions, DefinedDefaultAlgorithmAndOptions, ZlibOptions
} from 'compression-webpack-plugin'
import type { PluginOptions as CopyWebpackPluginOptions } from 'copy-webpack-plugin'
import type { Options as HTMLWebpackPluginOptions } from 'html-webpack-plugin'
import type { Options as EslintWebpackPluginOptions } from 'eslint-webpack-plugin'
import type { PluginOptions as MiniCSSExtractPluginOptions } from 'mini-css-extract-plugin'
import type { ReactRefreshPlugin } from '@pmmmwh/react-refresh-webpack-plugin'
import type { SwPluginOptions } from './plugin_sw'
import type { ConfigObject } from '../../types'
import type { Plugin } from './types'


type CompressionOptions =  BasePluginOptions<ZlibOptions>
    &   DefinedDefaultAlgorithmAndOptions<ZlibOptions>



const {
    webpack,
    plugins: {
        HTMLPlugin, fileCopyPlugin, compressionPlugin, miniCssExtract,
        reactRefresh, serviceWorkerPlugin, eslint
    }
} = DEPENDENCIES

const { ESLintExtensions } = COMMONS


// const resolvePluginDefaultOptions = <P extends Obj>(defaultOptions: Partial<P>, userOptions: any) => (
//     typeof userOptions == 'object'
//         ?   userOptions
//         :   typeof userOptions == 'function'
//             ?   userOptions(defaultOptions)
//             :   defaultOptions
// )


function getDefaultPluginsConfig(config: ConfigObject) {
    const { build, runMode, publicDir } = config
    const { isProd, isServer } = runMode!
    const { eslint: eslintOptions, input, output } = build!
    const outputFilenames = output!.filenames


    const compressionInstanceCommonOptions = {
        test: /\.*$/,
        threshold: 10240,
        deleteOriginalAssets: false
    } as const satisfies CompressionOptions


    return {
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
                    } satisfies CompressionOptions
                },
                gzip: {
                    options: {
                        ...compressionInstanceCommonOptions,
                        filename: outputFilenames!.gzip!
                    } satisfies CompressionOptions
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
            } satisfies CopyWebpackPluginOptions
        },

        [ pluginsKeysMap.sw ]: {
            plugin: serviceWorkerPlugin,
            enabled: !!input!.sw,
            options: {
                swPath: input!.sw!
            } satisfies SwPluginOptions
        },

        [ pluginsKeysMap.cssExtract ]: {
            plugin: miniCssExtract,
            enabled: isProd || !isServer,
            options: {
                experimentalUseImportModule: true,
                filename: outputFilenames!.styles!,
                chunkFilename: outputFilenames!.styles_chunk!
            } satisfies MiniCSSExtractPluginOptions
        },

        [ pluginsKeysMap.html ]: {
            plugin: HTMLPlugin,
            enabled: !!input!.html,
            options: {
                // scriptLoading: 'defer',
                template: input!.html as NonNullable<HTMLWebpackPluginOptions['template']>,
                minify: {
                    collapseWhitespace: true
                }
            } satisfies HTMLWebpackPluginOptions
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
            } satisfies DeepPartial<ReactRefreshPlugin['options']>
        },

        [ pluginsKeysMap.eslint ]: {
            plugin: eslint,
            enabled: !!eslintOptions,
            options: {
                extensions: ESLintExtensions as unknown as string[],
                configType: 'flat',
                emitWarning: true,
                failOnError: false
            } satisfies EslintWebpackPluginOptions
        }
    } as const satisfies Obj<Plugin>
}


export default getDefaultPluginsConfig