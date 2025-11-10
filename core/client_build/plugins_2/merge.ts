// @ts-nocheck

import type { WebpackPluginInstance } from 'webpack'
import type {
    DefaultPlugins, Plugins, AllCaseUserPluginConfig,
    UserPluginConfigObject, DefaultPluginsKeys, DefaultPluginsIntersact
} from '../plugins/types'


const mergeOptions = (
    defaultOptions: UserPluginConfigObject['options'],
    userOptions: UserPluginConfigObject['options'],
    rewrite: UserPluginConfigObject['rewrite']
) => (

    typeof userOptions == 'function'
        ?   userOptions(defaultOptions)

        :   !rewrite && typeof defaultOptions == 'object' && !Array.isArray(defaultOptions)
            ?   { ...defaultOptions, ...userOptions }
            :   userOptions
)

function addWithoutMerge(
    result: WebpackPluginInstance[],
    pluginConfig: UserPluginConfigObject | DefaultPluginsIntersact
) {

    const { instances, plugin, options } = pluginConfig

    if (instances) {
        Object.values(instances)
            .forEach(pluginInstance => {
                const { options, enabled = true } = pluginInstance
                enabled && result.push( new plugin!(options) )
            })

    } else result.push( new plugin!(options) )
}

const isEnabledByUserPlugin = (plugin: AllCaseUserPluginConfig) => (plugin as UserPluginConfigObject).enabled !== false


function merge(defaultPlugins: DefaultPlugins, userPlugins: Plugins = {}) {
    const result: WebpackPluginInstance[] = []

    Object.entries(defaultPlugins)
        .forEach(([ defaultPluginKey, defaultPluginConfig ]) => {
            const {
                plugin, options, instances, enabled = true
            } = defaultPluginConfig as DefaultPluginsIntersact


            const userPluginConfig = userPlugins[defaultPluginKey as keyof Plugins] as AllCaseUserPluginConfig
            if (!userPluginConfig || isEnabledByUserPlugin(userPluginConfig)) {
                if ((userPluginConfig as UserPluginConfigObject)?.plugin) {
                    const {
                        rewrite,
                        plugin: userPlugin = plugin,
                        options: userOptions,
                        instances: userInstances
                    } = userPluginConfig as UserPluginConfigObject

                    if (userInstances) {
                        Object.entries(userInstances)
                            .forEach(([ userPluginInstanceKey, userInstance ]) => {

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
                            })

                    } else {
                        const finalPluginOptions = mergeOptions(options, userOptions, rewrite)
                        result.push( new userPlugin(finalPluginOptions) )
                    }

                } else if (enabled) addWithoutMerge(result, defaultPluginConfig as DefaultPluginsIntersact)
            }
        })



    Object.entries(userPlugins)
        .forEach(([ userPluginKey, userCustomPluginConfig ]) => {
            if ((userCustomPluginConfig as UserPluginConfigObject).plugin) {
                const userCustomPluginConfigObject = userCustomPluginConfig as UserPluginConfigObject

                if (!defaultPlugins[userPluginKey as DefaultPluginsKeys] && isEnabledByUserPlugin(userCustomPluginConfigObject)) {
                    userCustomPluginConfigObject.plugin
                        ?   addWithoutMerge(result, userCustomPluginConfigObject)
                        :   console.error(`[config.build.plugins.${userPluginKey}] ->> property 'plugin' is missed.`)
                }
            }
        })


    return result
}


export default merge