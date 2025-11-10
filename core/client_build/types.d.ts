import type { Configuration as WebpackConfig, StatsOptions } from 'webpack'
import type { Options as HTMLWebpackPluginOptions } from 'html-webpack-plugin'
import type { Options as EslintWebpackPluginOptions } from 'eslint-webpack-plugin'
import type { PluginOptions as CopyWebpackPluginOptions } from 'copy-webpack-plugin'
import type { ConfigObject } from '../types'
import type { Plugins, DefaultEslintPluginOptions, DefaultHtmlPluginOptions } from './plugins/types'
import type { UserRulesData } from './module_rules/types'


type BuildConstants = typeof import('./constants.js')


type Filenames = {
    /** Assets filename */
    assets?: string

    /** Main js filename */
    js?: string

    /** JS chunk filename */
    js_chunk?: string

    /** Main styles filename */
    styles?: string

    /** Styles chunk filename */
    styles_chunk?: string

    /** Brotli compressed filename */
    brotli?: string

    /** GZIP compressed filename */
    gzip?: string
}



type BuildConfig = {
    input?: {
        /** List of directories and/or files to be processed by webpack's loaders */
        include?: string[]

        /** List of directories and/or files to exclude from being processed by webpack's loaders */
        exclude?: string[]

        /** Path to react application entrypoint */
        js?: string

        /** Path to service worker */
        sw?: string

        /** Path to site entrypoint */
        html?: HTMLWebpackPluginOptions
            |   NonNullable<HTMLWebpackPluginOptions['template']>
            |   ((defaultOptions: DefaultHtmlPluginOptions) => HTMLWebpackPluginOptions)

        /** CopyWebpackPlugin assets path */
        copyFiles?: CopyWebpackPluginOptions['patterns'] | string

        /** Path to styles files which will be included in every other styles file */
        sassResources?: string

        /** Enables svg2icon postcss plugin and set rootPath relatively to which icon paths will be resolved */
        iconsRoot?: string
    }

    output?: {
        /** target EcmaScript version */
        target?: string

        /** Webpack publicPath */
        publicPath?: NonNullable<WebpackConfig['output']>['publicPath']

        /**
         * Output files naming format
         * */
        filenames?: Filenames

        /* Webpack build logger params */
        logging?: StatsOptions
    }

    /** Enables ESlint */
    eslint?: boolean
        |   ((defaultOptions: DefaultEslintPluginOptions) => EslintWebpackPluginOptions)

    /** Webpack aliases */
    aliases?: Record<string, string>

    /** Webpack plugins config */
    plugins?: Plugins

    /** Webpack loaders config */
    module?: UserRulesData

    /**
     * Postprocess the final webpack config before being passed to webpack
     *
     * @param webpackConfig - Webpack config
     * @param config - Siegel config
     * @param buildConstants - Build constants
     */
    postProcessWebpackConfig?(
        webpackConfig: WebpackConfig,
        config: ConfigObject,
        buildConstants: BuildConstants
    ): WebpackConfig
}


export type { BuildConstants, BuildConfig, Filenames }