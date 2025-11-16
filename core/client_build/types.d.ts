import type { Configuration as WebpackConfig, StatsOptions } from 'webpack'
import type { PluginOptions as CopyWebpackPluginOptions } from 'copy-webpack-plugin'
import type { ConfigObject } from '../types'
import type { PluginsConfig } from './plugins/types'
import type { UserRulesData } from './module_rules/types'


type BuildConstants = typeof import('./constants.js')


type Filenames = {
    /** Assets filenames */
    assets?: string

    /** App js entrypoint filename */
    js?: string

    /** JS chunk filenames */
    js_chunk?: string

    /** Main style filename */
    styles?: string

    /** Styles chunk filenames */
    styles_chunk?: string

    /** Brotli compressed files filenames */
    brotli?: string

    /** GZIP compressed files filenames */
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
        html?: string

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

    /** Webpack aliases */
    aliases?: Record<string, string>

    /** Webpack plugins config */
    plugins?: PluginsConfig

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