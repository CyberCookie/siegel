const mergeOptions = (defaultOptions, userOptions, rewrite) => (
    typeof userOptions == 'function'
        ?   userOptions(defaultOptions)

        :   !rewrite && typeof defaultOptions == 'object'
            ?   Array.isArray(defaultOptions)
                ?   defaultOptions.concat(userOptions)

                :   Object.assign({}, defaultOptions, userOptions)

            :   userOptions
)

const isEnabledByUserPlugin = plugin => plugin && plugin.enabled !== false


module.exports = (defaultPlugins, userPlugins = {}) => {
    const result = []

    function addWithoutMerge(pluginConfig) {
        const { instances, plugin, options } = pluginConfig

        if (instances) {
            for (const instanceKey in instances) {
                const { enabled = true, options } = instances[instanceKey]
                enabled && result.push( new plugin(options) )
            }
        } else result.push( new plugin(options) )
    }

    for (const pluginKey in defaultPlugins) {
        const pluginConfig = defaultPlugins[pluginKey]
        const { plugin, options, instances, enabled = true } = pluginConfig

        const userPluginConfig = userPlugins[pluginKey]

        if (userPluginConfig !== false || isEnabledByUserPlugin(userPluginConfig)) {
            if (userPluginConfig) {
                const {
                    rewrite,
                    plugin: userPlugin = plugin,
                    options: userOptions,
                    instances: userInstances
                } = userPluginConfig

                if (userInstances) {
                    for (const userPluginInstanceKey in userInstances) {
                        const userInstance = userInstances[userPluginInstanceKey]

                        if (userInstance) {
                            const { rewrite, options: userInstanceOptions } = userInstance

                            let finalPluginInstanceOptions = userInstanceOptions
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
            } else if (enabled) addWithoutMerge(pluginConfig)
        }
    }

    for (const userPluginKey in userPlugins) {
        const userCustomPlugin = userPlugins[userPluginKey]

        if (!defaultPlugins[userPluginKey] && isEnabledByUserPlugin(userCustomPlugin)) {
            addWithoutMerge(userCustomPlugin)
        }
    }


    return result
}
export {}