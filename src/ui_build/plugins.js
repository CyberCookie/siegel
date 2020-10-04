const path                  = require('path')

const webpack               = require('webpack')
const HTMLPlugin            = require('html-webpack-plugin')
const fileCopyPlugin        = require('copy-webpack-plugin')
const compressionPlugin     = require('compression-webpack-plugin')
const cleanPlugin           = require('clean-webpack-plugin').CleanWebpackPlugin;
const serviceWorkerPlugin   = require('serviceworker-webpack-plugin')
const miniCssExtract        = require('mini-css-extract-plugin')
const reactRefresh          = require('@pmmmwh/react-refresh-webpack-plugin')



const mergeOptions = (defaultOptions, userOptions, rewrite) => (
    !rewrite && typeof defaultOptions == 'object'
        ?   Array.isArray(defaultOptions)
            ?   defaultOptions.concat(userOptions)
            :   Object.assign({}, defaultOptions, userOptions)
        :   userOptions
)

function mergePlugins(defaultPlugins, userPlugins = {}) {
    const result = []

    function addWithoutMerge(pluginConfig) {
        const { instances, enabled, plugin, options } = pluginConfig;

        if (instances) {
            for (const instanceKey in instances) {
                const { enabled, options } = instances[instanceKey]
                enabled && result.push( new plugin(options) )
            }
        } else if (enabled) {
            result.push( new plugin(options) )
        }
    }

    for (const pluginKey in defaultPlugins) {
        const pluginConfig = defaultPlugins[pluginKey]
        const { plugin, options, instances } = pluginConfig;

        if (userPlugins[pluginKey]) {
            const {
                rewrite,
                plugin: userPlugin = plugin,
                options: userOptions,
                instances: userInstances
            } = userPlugins[pluginKey]

            if (userInstances) {
                for (const userPluginInstanceKey in userInstances) {
                    const userInstance = userInstances[userPluginInstanceKey]

                    if (userInstance) {
                        const { rewrite, options: userInstanceOptions } = userInstance
    
                        let finalPluginInstanceOptions = userInstanceOptions;
                        const defaultInstance = instances[userPluginInstanceKey]

                        if (defaultInstance) {
                            finalPluginInstanceOptions = mergeOptions(defaultInstance.options, userInstanceOptions, rewrite)
                        }

                        result.push( new userPlugin(finalPluginInstanceOptions) )
                    }
                }
            } else {
                const finalPluginOptions = mergeOptions(options, userOptions, rewrite)
                result.push( new userPlugin(finalPluginOptions) )
            }
        } else if (userPlugins[pluginKey] !== false) {
            addWithoutMerge(pluginConfig)
        }
    }

    for (const userPluginKey in userPlugins) {
        defaultPlugins[userPluginKey] || addWithoutMerge(userPlugins[userPluginKey])
    }


    return result
}


function getPlugins(CONFIG, RUN_PARAMS) {
    const { input, output, plugins: userPlugins } = CONFIG.build;
    const { isProd, isServer, isDev } = RUN_PARAMS;
    

    const defaults = {
        compression: {
            plugin: compressionPlugin,
            instances: {
                br: {
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
                gzip: {
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

        copy: {
            plugin: fileCopyPlugin,
            enabled: input.assetsDir,
            options: {
                patterns: [{
                    from: input.assetsDir,
                    to: input.assetsDir && path.join(
                            output,
                            path.relative(
                                path.dirname(input.html),
                                input.assetsDir
                            )
                        )
                }]
            }
        },

        sw: {
            plugin: serviceWorkerPlugin,
            enabled: input.sw,
            options: {
                entry: input.sw,
                minify: true
            }
        },

        cssExtract: {
            plugin: miniCssExtract,
            enabled: isProd || !isServer,
            options: {
                filename: /*isDev ? 'styles.css' : */'styles.[contenthash].css',
                chunkFilename: /*isDev ? '[id].css' : */'[id].[contenthash].css'
            }
        },

        html: {
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

        hot: {
            plugin: webpack.HotModuleReplacementPlugin,
            enabled: !isProd
        },

        clean: {
            plugin: cleanPlugin,
            enabled: true
        },

        reactRefresh: {
            plugin: reactRefresh,
            enabled: !isProd
        }
    }


    return mergePlugins(defaults, userPlugins)
}


module.exports = getPlugins