

type DefaultPlugins = ReturnType<(typeof import('./defaults'))['default']>
// type DefaultPluginsWithInstances = NarrowObjectToValueTypes<DefaultPlugins, PluginInstances>
// type DefaultPluginsWithOptions = NarrowObjectToValueTypes<DefaultPlugins, PluginOptions>


//TODO typing?: review corectness
// type DeepExclude<O1, O2> =
//     {
//         [K in keyof O1 & keyof O2]?: O2[K] extends object
//             ?   O1[K] extends object
//                 ?   DeepExclude<O1[K], O2[K]>
//                 :   O2[K]
//             :   O2[K]
//     }
//     &
//     { [K in keyof Omit<O2, keyof O1>]: O2[K] }



type PluginOptions = {
    options?: Obj
    instances?: never
}
type PluginInstances = {
    instances?: {
        [instanceKey: string]: PluginEnabled & PluginOptions
    }
    options?: never
}
type PluginEnabled = {
    enabled?: boolean
}
type Plugin = {
    plugin: new (...args: any) => any
} & PluginEnabled & (PluginOptions | PluginInstances)



type PluginsConfig = {
    defaultPlugins: {
        [defaultPluginKey in keyof DefaultPlugins]: {
            enabled?: boolean
        }
        // & DefaultPlugins[defaultPluginKey] extends { instances: any }
        //     ?   {
        //         [defaultPluginInstanceKey in keyof DefaultPlugins[defaultPluginKey]['instances']]: {}
        //     }
        //     :   {}
    }

    userPlugins: {
        [pluginKey: string]: {
            plugin: Plugin
        }
    }
}



export type { PluginsConfig, Plugin }