const webpack               = require('webpack')
const HTMLPlugin            = require('html-webpack-plugin')
const fileCopyPlugin        = require('copy-webpack-plugin')
const compressionPlugin     = require('compression-webpack-plugin')
const cleanPlugin           = require('clean-webpack-plugin').CleanWebpackPlugin;
const serviceWorkerPlugin   = require('serviceworker-webpack-plugin')
const miniCssExtract        = require('mini-css-extract-plugin')



function mergeOptions(defaultOptions, userOptions, rewrite) {
    let result = userOptions;
    if (typeof defaultOptions == 'object' && !rewrite) {
        result = Array.isArray(defaultOptions)
            ?   defaultOptions.concat(userOptions)
            :   Object.assign({}, defaultOptions, userOptions)
    }

    return result
}


function mergePlugins(defaultPlugins, userPlugins = {}) {
    let result = []

    function addWithNoMerge(pluginConfig) {
        let { instances, enabled, plugin, options } = pluginConfig;

        if (instances) {
            for (let instanceKey in instances) {
                let { enabled, options } = instances[instanceKey]
                enabled && result.push( new plugin(options) )
            }
        } else if (enabled) {
            result.push( new plugin(options) )
        }
    }

    for (let pluginKey in defaultPlugins) {
        let pluginConfig = defaultPlugins[pluginKey]
        let { plugin, options, instances } = pluginConfig;

        if (userPlugins[pluginKey]) {
            let {
                rewrite,
                plugin: userPlugin = plugin,
                options: userOptions,
                instances: userInstances
            } = userPlugins[pluginKey]

            if (userInstances) {
                for (let userPluginInstanceKey in userInstances) {
                    let userInstance = userInstances[userPluginInstanceKey]

                    if (userInstance) {
                        let { rewrite, options: userInstanceOptions } = userInstance
    
                        let finalPluginInstanceOptions = userInstanceOptions;
                        let defaultInstance = instances[userPluginInstanceKey]

                        if (defaultInstance) {
                            finalPluginInstanceOptions = mergeOptions(defaultInstance.options, userInstanceOptions, rewrite)
                        }

                        result.push( new userPlugin(finalPluginInstanceOptions) )
                    }
                }
            } else {
                let finalPluginOptions = mergeOptions(options, userOptions, rewrite)
                result.push( new userPlugin(finalPluginOptions) )
            }
        } else if (userPlugins[pluginKey] !== false) {
            addWithNoMerge(pluginConfig)
        }
    }

    for (let userPluginKey in userPlugins) {
        defaultPlugins[userPluginKey] || addWithNoMerge(userPlugins[userPluginKey])
    }


    return result
}


function getPlugins(CONFIG, RUN_PARAMS) {
    const { input, output, plugins: userPlugins } = CONFIG.build;
    const { isProd, isServer } = RUN_PARAMS;


    let defaults = {
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
            enabled: true,
            options: [
                { from: input.assets.images, to: output.assets + '/images' },
                { from: input.assets.pwa, to: output.assets + '/pwa' }
            ]
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
                filename: 'styles.[hash].css'
            }
        },

        html: {
            plugin: HTMLPlugin,
            enabled: input.html,
            options: {
                template: input.html,
                minify: {
                    collapseWhitespace: true
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
        }
    }


    return mergePlugins(defaults, userPlugins)
}


module.exports = getPlugins