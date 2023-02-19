import type { HotModuleReplacementPlugin, WebpackPluginInstance } from 'webpack'
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
type CssOptimizePlugin = typeof import('css-minimizer-webpack-plugin')
type CopyPlugin = typeof import('copy-webpack-plugin')
type EslintPlugin = typeof import('eslint-webpack-plugin')


//TODO typing: review corectness
type DeepExclude<O1 extends object, O2 extends object> =
    {
        [K in keyof O1 & keyof O2]?: O2[K] extends object
            ?   O1[K] extends object
                ?   DeepExclude<O1[K], O2[K]>
                :   O2[K]
            :   O2[K]
    }
    &
    { [K in keyof Omit<O2, keyof O1>]: O2[K] }



type PluginClassCtor = {
    new(...options: unknown[]): WebpackPluginInstance
    (): WebpackPluginInstance
}

type AnyPlugin = abstract new (...args: any) => any


type ResolvePluginDefaultOptions = (
    defaultOption: Obj,
    userOption: any
) => any


type PluginConfigBase<_Plugin, _DefaultOptions> = {
    plugin: _Plugin
    enabled?: boolean
}
&   (_DefaultOptions extends null ? {} : { rewrite?: boolean })

type PluginConfigOptions<_PluginOpts, _DefaultOpts, _Options> = {
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

type PluginConfigInstances<_PluginOpts, _DefaultInstances> = {
    instances:
        {
            [ K in keyof _DefaultInstances ]?: PluginComfigInstance<_DefaultInstances[K], _PluginOpts>
        }
        &
        {
            [ key: string ]: PluginComfigInstance<any, _PluginOpts>
        }
    options?: never
}

type PluginComfigInstance<_PluginInstance, _PluginOpts> = {
    options?: DeepExclude<_PluginInstance['options'], _PluginOpts>
    enabled?: boolean
    rewrite?: boolean
} | false


type UserPlugin<
    _Plugin extends AnyPlugin = AnyPlugin,
    _DefaultOpts = null,
    _Options = null,
    _DefaultInstances = null,
    _PluginOpts = NonNullable<ConstructorParameters<_Plugin>[0]>
> = Partial<
    PluginConfigBase<_Plugin, _DefaultOpts>
    &   (
        PluginConfigOptions<_PluginOpts, _DefaultOpts, _Options>
        |
        PluginConfigInstances<_PluginOpts, _DefaultInstances>
    )
> | boolean

type AllCaseUserPluginConfig = Exclude<UserPlugin<AnyPlugin, {}, {}, {}, {}>, boolean>


//TODO typing: required custom plugin and never predefined
type Plugins = {
    compression?: UserPlugin<CompressionPlugin, null, null, DefaultPlugins['compression']['instances']>

    copy?: UserPlugin<CopyPlugin, DefaultPlugins['copy']['options']>

    sw?: UserPlugin<SwPluginClassCtor, DefaultPlugins['sw']['options']>

    cssExtract?: UserPlugin<CssExtractPlugin, DefaultPlugins['cssExtract']['options']>

    cssOptimize?: UserPlugin<CssOptimizePlugin>

    html?: UserPlugin<
        HtmlPlugin,
        DefaultHtmlPluginOptions,
        HTMLWebpackPluginOptions | HTMLWebpackPluginOptions['template']
    >

    hot?: UserPlugin<typeof HotModuleReplacementPlugin>

    reactRefresh?: UserPlugin<ReactRefreshPlugin>

    eslint?: UserPlugin<EslintPlugin, DefaultEslintPluginOptions>

} & Partial<{ [key: string]: AllCaseUserPluginConfig }>



type CompressionInstanceCommonOptions = readonly {
    test: RegExp
    threshold: Required<CompressionWebpackPluginOptions<any>>['threshold']
    deleteOriginalAssets: boolean
}

type DefaultHtmlPluginOptions = readonly {
    template: NonNullable<HTMLWebpackPluginOptions['template']>
    minify: {
        collapseWhitespace: NonNullable<NonNullable<HTMLMinifyOptions>['collapseWhitespace']>
    }
}

type DefaultEslintPluginOptions = readonly {
    extensions: string[]
    emitWarning: boolean
}

type DefaultPlugins = readonly {
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
            patterns: NonNullable<NonNullable<BuildConfig['input']>['copyFiles']>
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

    cssOptimize: {
        plugin: CssOptimizePlugin
        enabled: boolean
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



export type {
    CompressionInstanceCommonOptions, CopyWebpackPluginOptions, ResolvePluginDefaultOptions,
    DefaultPlugins, Plugins, PluginComfigInstance, AllCaseUserPluginConfig
}