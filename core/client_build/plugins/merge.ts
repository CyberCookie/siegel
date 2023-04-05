import type { WebpackPluginInstance } from 'webpack'
import type { DefaultPlugins, Plugins, AllCaseUserPluginConfig, PluginConfigInstance } from './types'


const mergeOptions = (
    defaultOptions: AllCaseUserPluginConfig['options'],
    userOptions: AllCaseUserPluginConfig['options'],
    rewrite: AllCaseUserPluginConfig['rewrite']
) => (

    typeof userOptions == 'function'
        ?   userOptions(defaultOptions)

        :   !rewrite && typeof defaultOptions == 'object' && !Array.isArray(defaultOptions)
            ?   { ...defaultOptions, ...userOptions }
            :   userOptions
)

function addWithoutMerge(result: WebpackPluginInstance[], pluginConfig: AllCaseUserPluginConfig) {
    const { instances, plugin, options } = pluginConfig

    if (instances) {
        for (const instanceKey in instances) {
            const { enabled = true, options } = instances[instanceKey] as Exclude<PluginConfigInstance<any, any>, boolean>
            enabled && result.push( new (plugin as any)(options) )
        }

    } else result.push( new (plugin as any)(options) )
}

const isEnabledByUserPlugin = (plugin: AllCaseUserPluginConfig) => plugin.enabled !== false


function merge(defaultPlugins: DefaultPlugins, userPlugins: Plugins = {}) {
    const result: WebpackPluginInstance[] = []

    for (const pluginKey in defaultPlugins) {
        const pluginConfig = defaultPlugins[pluginKey as keyof DefaultPlugins]
        const { plugin, options, instances, enabled = true } = pluginConfig as AllCaseUserPluginConfig

        const userPluginConfig = userPlugins[pluginKey as keyof Plugins]

        if (!userPluginConfig || (userPluginConfig && isEnabledByUserPlugin(userPluginConfig))) {
            if (userPluginConfig) {
                const {
                    rewrite,
                    plugin: userPlugin = plugin,
                    options: userOptions,
                    instances: userInstances
                } = userPluginConfig as AllCaseUserPluginConfig

                if (userInstances) {
                    for (const userPluginInstanceKey in userInstances) {
                        const userInstance = userInstances[userPluginInstanceKey]

                        if (userInstance) {
                            const { rewrite, options: userInstanceOptions } = userInstance

                            let finalPluginInstanceOptions = userInstanceOptions

                            if (instances) {
                                const defaultInstance = instances[userPluginInstanceKey]

                                if (defaultInstance) {
                                    finalPluginInstanceOptions = mergeOptions(defaultInstance.options, userInstanceOptions, rewrite)
                                }
                            }

                            result.push( new (userPlugin as any)(finalPluginInstanceOptions) )
                        }
                    }

                } else {
                    const finalPluginOptions = mergeOptions(options, userOptions, rewrite)
                    result.push( new (userPlugin as any)(finalPluginOptions) )
                }

            } else if (enabled) addWithoutMerge(result, pluginConfig as AllCaseUserPluginConfig)
        }
    }


    for (const userPluginKey in userPlugins) {
        const userCustomPlugin = userPlugins[userPluginKey]!

        if (!defaultPlugins[userPluginKey as keyof DefaultPlugins] && isEnabledByUserPlugin(userCustomPlugin)) {
            (userCustomPlugin as AllCaseUserPluginConfig).plugin
                ?   addWithoutMerge(result, userCustomPlugin as AllCaseUserPluginConfig)
                :   console.error(`[config.build.plugins.${userPluginKey}] ->> property 'plugin' is missed.`)
        }
    }


    return result
}


export default merge