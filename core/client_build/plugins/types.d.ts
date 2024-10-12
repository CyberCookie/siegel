import type { HotModuleReplacementPlugin } from 'webpack'
import type {
    Options as HTMLWebpackPluginOptions,
    MinifyOptions as HTMLMinifyOptions
} from 'html-webpack-plugin'
import type { BasePluginOptions as CompressionWebpackPluginOptions } from 'compression-webpack-plugin'
import type { PluginOptions as CopyWebpackPluginOptions } from 'copy-webpack-plugin'
import type { Options as EslintWebpackPluginOptions } from 'eslint-webpack-plugin'
import type { Filenames, BuildConfig } from '../types'
import type { SwPluginClassCtor, SwPluginOptions } from './plugin_sw'



type ReactRefreshPlugin = typeof import('@pmmmwh/react-refresh-webpack-plugin')
type HtmlPlugin = typeof import('html-webpack-plugin')
type CompressionPlugin = typeof import('compression-webpack-plugin')
type CssExtractPlugin = typeof import('mini-css-extract-plugin')
type CopyPlugin = typeof import('copy-webpack-plugin')
type EslintPlugin = typeof import('eslint-webpack-plugin')


//TODO typing?: review corectness
type DeepExclude<O1, O2> =
    {
        [K in keyof O1 & keyof O2]?: O2[K] extends object
            ?   O1[K] extends object
                ?   DeepExclude<O1[K], O2[K]>
                :   O2[K]
            :   O2[K]
    }
    &
    { [K in keyof Omit<O2, keyof O1>]: O2[K] }



type AnyPlugin = abstract new (...args: any) => any
type AnyPluginInstance = Exclude<PluginConfigInstance<any, any>, boolean>
type AnyPluginInstances = Record<string, AnyPluginInstance>
type AllCaseUserPluginConfig = UserPlugin<AnyPlugin, {}, {}, {}, {}>
type UserPluginObjectConfig = Exclude<AllCaseUserPluginConfig, boolean>


type PluginConfigBase<_Plugin, _DefaultOptions> = {
    plugin: _Plugin
    enabled?: boolean
} & (_DefaultOptions extends null ? {} : { rewrite?: boolean })

type PluginConfigOptions<
    _PluginOpts,
    _DefaultOpts,
    _Options
> = {
    options: (
        _Options extends null
            ?   (
                    _DefaultOpts extends object
                        ?   DeepExclude<_DefaultOpts, _PluginOpts>
                        :   _PluginOpts
                )   |   ((defaultOpions: _DefaultOpts) => _PluginOpts)
            :   _Options
    )
    instances?: never
}

type PluginConfigInstances<
    _PluginOpts extends Obj,
    _DefaultInstances extends AnyPluginInstances | null
> = _DefaultInstances extends null
    ?   never
    :   {
            instances:
                {
                    [ K in keyof _DefaultInstances ]?:
                        PluginConfigInstance<
                            Exclude<_DefaultInstances, null>[K],
                            _PluginOpts
                        >
                }
                &
                {
                    [ key: string ]:
                        PluginConfigInstance<
                            PluginConfigOptions<_PluginOpts, Obj, Obj>,
                            _PluginOpts
                        >
                }
            options?: never
        }

type PluginConfigInstance<
    _PluginInstance extends Exclude<PluginConfigInstance<any, any>, boolean>,
    _PluginOpts extends Obj
> = {
    options?: DeepExclude<_PluginInstance['options'], _PluginOpts>
    enabled?: boolean
    rewrite?: boolean
} | false


type UserPlugin<
    _Plugin extends AnyPlugin,
    _DefaultOpts = null,
    _Options = null,
    _DefaultInstances extends AnyPluginInstances | null = null,
    _PluginOpts extends Obj = NonNullable<ConstructorParameters<_Plugin>[0]>
> = Partial<
        PluginConfigBase<_Plugin, _DefaultOpts>
        &   (
                PluginConfigOptions<_PluginOpts, _DefaultOpts, _Options>
                |
                PluginConfigInstances<_PluginOpts, _DefaultInstances>
            )
    > | boolean


//TODO typing: user plugin options
type Plugins = {
    compression?: UserPlugin<CompressionPlugin, null, null, DefaultPlugins['compression']['instances']>

    copy?: UserPlugin<CopyPlugin, DefaultPlugins['copy']['options']>

    sw?: UserPlugin<SwPluginClassCtor, DefaultPlugins['sw']['options']>

    cssExtract?: UserPlugin<CssExtractPlugin, DefaultPlugins['cssExtract']['options']>

    html?: UserPlugin<
        HtmlPlugin,
        DefaultHtmlPluginOptions,
        HTMLWebpackPluginOptions | HTMLWebpackPluginOptions['template']
    >

    hot?: UserPlugin<typeof HotModuleReplacementPlugin>

    reactRefresh?: UserPlugin<ReactRefreshPlugin>

    eslint?: UserPlugin<EslintPlugin, DefaultEslintPluginOptions>

} & Obj<
    MakeRequiredFields<
        Exclude<AllCaseUserPluginConfig, boolean>,
        'plugin'
    > | boolean
>



type CompressionInstanceCommonOptions = {
    test: RegExp
    threshold: Required<CompressionWebpackPluginOptions<any>>['threshold']
    deleteOriginalAssets: boolean
}

type DefaultHtmlPluginOptions = {
    template: NonNullable<HTMLWebpackPluginOptions['template']>
    minify: {
        collapseWhitespace: NonNullable<NonNullable<HTMLMinifyOptions>['collapseWhitespace']>
    }
}

type DefaultEslintPluginOptions = {
    extensions: string[]
    emitWarning: boolean
    configType: string
} & Partial<EslintWebpackPluginOptions>

type DefaultPlugins = {
    compression: {
        plugin: CompressionPlugin
        enabled: boolean
        instances: {
            br: {
                options: {
                    filename: NonNullable<Filenames['brotli']>
                    algorithm: string
                    compressionOptions: {
                        level: number
                    }
                } & CompressionInstanceCommonOptions
            }
            gzip: {
                options: {
                    filename: NonNullable<Filenames['gzip']>
                } & CompressionInstanceCommonOptions
            }
        }
    }

    copy: {
        plugin: CopyPlugin
        enabled: boolean
        options: {
            patterns: Exclude<NonNullable<NonNullable<BuildConfig['input']>['copyFiles']>, string>
        }
    }

    sw: {
        plugin: SwPluginClassCtor
        enabled: boolean
        options: SwPluginOptions
    }

    cssExtract: {
        plugin: CssExtractPlugin
        enabled: boolean
        options: {
            experimentalUseImportModule: boolean
            filename: NonNullable<Filenames['styles']>
            chunkFilename: NonNullable<Filenames['styles_chunk']>
        }
    }

    html: {
        plugin: HtmlPlugin
        enabled: boolean
        options: DefaultHtmlPluginOptions | HTMLWebpackPluginOptions
    }

    hot: {
        plugin: typeof HotModuleReplacementPlugin
        enabled: boolean
    }

    reactRefresh: {
        plugin: ReactRefreshPlugin
        enabled: boolean
    }

    eslint: {
        plugin: EslintPlugin
        enabled: boolean
        options: DefaultEslintPluginOptions | EslintWebpackPluginOptions
    }
}
type DefaultPluginsKeys = keyof DefaultPlugins



export type {
    CompressionInstanceCommonOptions, CopyWebpackPluginOptions,
    DefaultPlugins, DefaultPluginsKeys, Plugins, PluginConfigInstance,
    AllCaseUserPluginConfig, UserPluginObjectConfig,
    DefaultEslintPluginOptions, DefaultHtmlPluginOptions
}