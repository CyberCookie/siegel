import type {
    BasePluginOptions, DefinedDefaultAlgorithmAndOptions, ZlibOptions
} from 'compression-webpack-plugin'
import type { PluginOptions as CopyWebpackPluginOptions } from 'copy-webpack-plugin'
import type { Options as HTMLWebpackPluginOptions } from 'html-webpack-plugin'
import type { Options as EslintWebpackPluginOptions } from 'eslint-webpack-plugin'
import type { PluginOptions as MiniCSSExtractPluginOptions } from 'mini-css-extract-plugin'
import type { ReactRefreshPlugin } from '@pmmmwh/react-refresh-webpack-plugin'
import type { SwPluginOptions } from './plugin_sw'


type DefaultPluginOptions = {
    compression: BasePluginOptions<ZlibOptions>
        &   DefinedDefaultAlgorithmAndOptions<ZlibOptions>
    copy: CopyWebpackPluginOptions
    sw: SwPluginOptions
    cssExtract: MiniCSSExtractPluginOptions
    html: HTMLWebpackPluginOptions
    hot: any
    reactRefresh: DeepPartial<ReactRefreshPlugin['options']>
    eslint: EslintWebpackPluginOptions
}

type DefaultPlugins = ReturnType<(typeof import('./defaults'))['default']>
type DefaultPluginsKeys = keyof DefaultPlugins

type DefaultPluginsWithInstancesKeys = keyof NarrowObjectToValueTypes<DefaultPlugins, PluginInstances>
type DefaultPluginsWithOptionsKeys = keyof NarrowObjectToValueTypes<DefaultPlugins, PluginOptions>
type DefaultPluginsWithoutConfigKeys = Exclude<
    DefaultPluginsKeys,
    DefaultPluginsWithInstancesKeys | DefaultPluginsWithOptionsKeys
>


type AnyPluginCtor = new (...args: any) => any
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
    plugin: AnyPluginCtor
} & PluginEnabled & (PluginOptions | PluginInstances)



type PluginsConfig = {
    defaultPlugins?: {
        [defaultPluginKey in DefaultPluginsWithoutConfigKeys]?: PluginEnabled | boolean

    } & {
        [defaultPluginKey in DefaultPluginsWithOptionsKeys]?: ({
            options?(
                defaultOptions: DefaultPlugins[defaultPluginKey]['options']
            ): DefaultPluginOptions[defaultPluginKey]
        } & PluginEnabled) | boolean

    } & {
        [defaultPluginKey in DefaultPluginsWithInstancesKeys]?: ({
            instances?: {
                [defaultPluginInstanceKey in keyof DefaultPlugins[DefaultPluginsWithInstancesKeys]['instances']]?: ({
                    options?(
                        defaultInstanceOptions: DefaultPlugins[defaultPluginKey]['instances'][defaultPluginInstanceKey]['options']
                    ): DefaultPluginOptions[defaultPluginKey]
                } & PluginEnabled) | boolean
            }
        } & PluginEnabled) | boolean
    }

    userPlugins?: {
        [pluginKey: string]: Plugin
    }
}


export type {
    DefaultPlugins, DefaultPluginsKeys, DefaultPluginOptions,
    Plugin, AnyPluginCtor, PluginsConfig
}