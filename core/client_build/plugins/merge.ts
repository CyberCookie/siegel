import type { WebpackPluginInstance } from 'webpack'
import type {
    DefaultPlugins, Plugins, AllCaseUserPluginConfig, PluginConfigInstance,
    UserPluginObjectConfig, DefaultPluginsKeys, DefaultPluginsIntersact
} from './types'


const mergeOptions = (
    defaultOptions: UserPluginObjectConfig['options'],
    userOptions: UserPluginObjectConfig['options'],
    rewrite: UserPluginObjectConfig['rewrite']
) => (

    typeof userOptions == 'function'
        ?   userOptions(defaultOptions)

        :   !rewrite && typeof defaultOptions == 'object' && !Array.isArray(defaultOptions)
            ?   { ...defaultOptions, ...userOptions }
            :   userOptions
)

function addWithoutMerge(
    result: WebpackPluginInstance[],
    pluginConfig: UserPluginObjectConfig | DefaultPluginsIntersact
) {

    const { instances, plugin, options } = pluginConfig

    if (instances) {
        for (const instanceKey in instances) {
            const {
                enabled = true, options
            } = instances[instanceKey as keyof typeof instances] as Exclude<PluginConfigInstance<any, any>, boolean>
            enabled && result.push( new plugin!(options) )
        }

    } else result.push( new plugin!(options) )
}

const isEnabledByUserPlugin = (plugin: AllCaseUserPluginConfig) => (plugin as UserPluginObjectConfig).enabled !== false


function merge(defaultPlugins: DefaultPlugins, userPlugins: Plugins = {}) {
    const result: WebpackPluginInstance[] = []

    for (const defaultPluginKey in defaultPlugins) {
        const defaultPluginConfig = defaultPlugins[defaultPluginKey as DefaultPluginsKeys]
        const {
            plugin, options, instances, enabled = true
        } = defaultPluginConfig as DefaultPluginsIntersact


        const userPluginConfig = userPlugins[defaultPluginKey as keyof Plugins] as AllCaseUserPluginConfig
        if (!userPluginConfig || isEnabledByUserPlugin(userPluginConfig)) {
            if ((userPluginConfig as UserPluginObjectConfig)?.plugin) {
                const {
                    rewrite,
                    plugin: userPlugin = plugin,
                    options: userOptions,
                    instances: userInstances
                } = userPluginConfig as UserPluginObjectConfig

                if (userInstances) {
                    for (const userPluginInstanceKey in userInstances) {
                        const userInstance = userInstances[userPluginInstanceKey]

                        if (userInstance) {
                            const { rewrite, options: userInstanceOptions } = userInstance

                            let finalPluginInstanceOptions = userInstanceOptions

                            if (instances) {
                                const defaultInstance = instances[userPluginInstanceKey as keyof typeof instances]

                                if (defaultInstance) {
                                    finalPluginInstanceOptions = mergeOptions(defaultInstance.options, userInstanceOptions, rewrite)
                                }
                            }

                            result.push( new userPlugin(finalPluginInstanceOptions) )
                        }
                    }

                } else {
                    const finalPluginOptions = mergeOptions(options, userOptions, rewrite)
                    result.push( new userPlugin(finalPluginOptions) )
                }

            } else if (enabled) addWithoutMerge(result, defaultPluginConfig as DefaultPluginsIntersact)
        }
    }


    for (const userPluginKey in userPlugins) {
        const userCustomPluginConfig = userPlugins[userPluginKey]

        if ((userCustomPluginConfig as UserPluginObjectConfig).plugin) {
            const userCustomPluginObjectConfig = userCustomPluginConfig as UserPluginObjectConfig

            if (!defaultPlugins[userPluginKey as DefaultPluginsKeys] && isEnabledByUserPlugin(userCustomPluginObjectConfig)) {
                userCustomPluginObjectConfig.plugin
                    ?   addWithoutMerge(result, userCustomPluginObjectConfig)
                    :   console.error(`[config.build.plugins.${userPluginKey}] ->> property 'plugin' is missed.`)
            }
        }
    }


    return result
}


export default merge