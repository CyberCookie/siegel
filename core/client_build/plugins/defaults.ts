import path from 'path'

import { COMMONS, DEPENDENCIES, pluginsKeysMap } from '../constants.js'

import type { ConfigObject } from '../../types'
import type { Plugin, DefaultPluginOptions } from './types'


const {
    webpack,
    plugins: {
        HTMLPlugin, fileCopyPlugin, compressionPlugin, miniCssExtract,
        reactRefresh, serviceWorkerPlugin, eslint
    }
} = DEPENDENCIES

const { ESLintExtensions } = COMMONS


function getDefaultPluginsConfig(config: ConfigObject) {
    const { build, server, runMode, publicDir } = config
    const { isProd, isServer } = runMode!
    const { serveCompressionsPriority } = server!
    const { input, output } = build!
    const outputFilenames = output!.filenames


    const compressionTypesSet = new Set(serveCompressionsPriority)

    const compressionInstanceCommonOptions = {
        test: /\.*$/,
        threshold: 10240,
        deleteOriginalAssets: false
    } as const satisfies DefaultPluginOptions['compression']


    return {
        [ pluginsKeysMap.compression ]: {
            plugin: compressionPlugin,
            enabled: !!compressionTypesSet.size && isProd!,
            instances: {
                br: {
                    enabled: compressionTypesSet.has('br'),
                    options: {
                        ...compressionInstanceCommonOptions,
                        filename: outputFilenames!.brotli!,
                        algorithm: 'brotliCompress',
                        compressionOptions: {
                            level: 11
                        }
                    } satisfies DefaultPluginOptions['compression']
                },
                gzip: {
                    enabled: compressionTypesSet.has('gzip'),
                    options: {
                        ...compressionInstanceCommonOptions,
                        filename: outputFilenames!.gzip!
                    } satisfies DefaultPluginOptions['compression']
                }
            }
        },

        [ pluginsKeysMap.copy ]: {
            plugin: fileCopyPlugin,
            enabled: !!input!.copyFiles,
            options: {
                patterns: typeof input!.copyFiles == 'string'
                    ?   [{
                            from: input!.copyFiles,
                            to: path.join(
                                    publicDir!,
                                    path.relative(
                                        path.dirname(input!.html || input!.js!),
                                        input!.copyFiles
                                    )
                                )
                        }]
                    :   input!.copyFiles!
            } satisfies DefaultPluginOptions['copy']
        },

        [ pluginsKeysMap.sw ]: {
            plugin: serviceWorkerPlugin,
            enabled: !!input!.sw,
            options: {
                swPath: input!.sw!
            } satisfies DefaultPluginOptions['sw']
        },

        [ pluginsKeysMap.cssExtract ]: {
            plugin: miniCssExtract,
            enabled: isProd || !isServer,
            options: {
                experimentalUseImportModule: true,
                filename: outputFilenames!.styles!,
                chunkFilename: outputFilenames!.styles_chunk!
            } satisfies DefaultPluginOptions['cssExtract']
        },

        [ pluginsKeysMap.html ]: {
            plugin: HTMLPlugin,
            enabled: !!input!.html,
            options: {
                // scriptLoading: 'defer',
                template: input!.html,
                minify: {
                    collapseWhitespace: true
                }
            } satisfies DefaultPluginOptions['html']
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
            } satisfies DefaultPluginOptions['reactRefresh']
        },

        [ pluginsKeysMap.eslint ]: {
            plugin: eslint,
            enabled: false,
            options: {
                extensions: ESLintExtensions as unknown as string[],
                configType: 'flat',
                emitWarning: true,
                failOnError: false
            } satisfies DefaultPluginOptions['eslint']
        }
    } as const satisfies Record<keyof DefaultPluginOptions, Plugin>
}


export default getDefaultPluginsConfig