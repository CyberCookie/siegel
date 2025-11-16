import isExists from '../../../common/is/exists'

import type {
    DefaultPlugins, DefaultPluginsKeys,
    Plugin, PluginsConfig, AnyPluginCtor
} from './types'


const INSTANCES_KEY = 'instances'
const OPTIONS_KEY = 'options'


function merge(
    innerDefaultPlugins: DefaultPlugins,
    pluginsConfig: PluginsConfig = {}
) {

    const { defaultPlugins = {}, userPlugins = {} } = pluginsConfig
    const innerDefaultPluginsKeys = Object.keys(innerDefaultPlugins)

    const result: {
        plugin: AnyPluginCtor
        options?: Obj
    }[] = []

    function addPlugin(pluginConfig: Plugin) {
        const { plugin, options, instances } = pluginConfig

        instances
            ?   Object.keys(instances).forEach(instanceKey => {
                    const { enabled = true, options } = instances[instanceKey]
                    enabled && result.push({ plugin, options })
                })

            :   result.push({ plugin, options })
    }


    innerDefaultPluginsKeys.forEach(key => {

        const innerDefaultPluginKey = key as DefaultPluginsKeys
        if (!(innerDefaultPluginKey in pluginsConfig)) {

            const innerDefaultPluginConfig = innerDefaultPlugins[innerDefaultPluginKey]
            const { enabled, plugin } = innerDefaultPluginConfig

            const userDefaultPluginRewrite = defaultPlugins[innerDefaultPluginKey]
            if (isExists(userDefaultPluginRewrite)) {

                const isRewriteWithObjConfig = typeof userDefaultPluginRewrite != 'boolean'
                const isEnabled = isRewriteWithObjConfig
                    ?   userDefaultPluginRewrite.enabled
                    :   userDefaultPluginRewrite

                if (isEnabled) {
                    if (isRewriteWithObjConfig) {
                        if (
                                INSTANCES_KEY in userDefaultPluginRewrite
                            &&  INSTANCES_KEY in innerDefaultPluginConfig
                        ) {

                            const { instances } = userDefaultPluginRewrite
                            instances && Object.keys(instances).forEach(key => {

                                const userRewriteInstanceKey = key as keyof typeof instances
                                const userDefaultPluginInstanceRewrite = instances[userRewriteInstanceKey]
                                if (isExists(userDefaultPluginInstanceRewrite)) {

                                    const isRewriteWithObjConfig = typeof userDefaultPluginInstanceRewrite != 'boolean'
                                    const isEnabled = isRewriteWithObjConfig
                                        ?   userDefaultPluginInstanceRewrite.enabled
                                        :   userDefaultPluginInstanceRewrite

                                    if (isEnabled) {
                                        const { options } = innerDefaultPluginConfig.instances[userRewriteInstanceKey]

                                        result.push({
                                            plugin,
                                            options: isRewriteWithObjConfig
                                                ?   userDefaultPluginInstanceRewrite.options?.(
                                                        options as UnionToIntersection<typeof options>
                                                    ) || options
                                                :   innerDefaultPluginConfig
                                        })
                                    }

                                } else {
                                    result.push({
                                        plugin,
                                        options: innerDefaultPluginConfig.instances[userRewriteInstanceKey].options
                                    })
                                }
                            })

                        } else {
                            result.push({
                                plugin,
                                options: OPTIONS_KEY in innerDefaultPluginConfig
                                    ?   OPTIONS_KEY in userDefaultPluginRewrite && typeof userDefaultPluginRewrite.options == 'function'
                                        ?   userDefaultPluginRewrite.options(
                                                innerDefaultPluginConfig
                                                    .options as UnionToIntersection<typeof innerDefaultPluginConfig.options>
                                            )
                                        :   innerDefaultPluginConfig.options
                                    :   undefined
                            })
                        }

                    } else addPlugin(innerDefaultPluginConfig)
                }
            } else if (enabled) addPlugin(innerDefaultPluginConfig)
        }
    })


    Object.keys(userPlugins).forEach(userNewPluginKey => {
        const userNewPlugin = userPlugins[userNewPluginKey]
        const { enabled = true } = userNewPlugin

        enabled && addPlugin(userNewPlugin)
    })


    return result
}


export default merge