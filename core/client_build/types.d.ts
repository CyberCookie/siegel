import type { Configuration as WebpackConfig } from 'webpack'
import type { Options as HTMLWebpackPluginOptions } from 'html-webpack-plugin'
import type { PluginOptions as CopyWebpackPluginOptions } from 'copy-webpack-plugin'
import type { ConfigFinal } from '../types'
import type { Plugins } from './plugins/types'
import type { Modules } from './modules/types'


type BuildConstants = typeof import('./constants.js')


type FilenamesCommon = {
    assets?: string
    js?: string
    js_chunk?: string
    styles?: string
    styles_chunk?: string
}
type FilenamesProd = {
    brotli?: string
    gzip?: string
} & FilenamesCommon



type BuildConfig = {
    input?: {
        js?: string
        sw?: string
        html?: HTMLWebpackPluginOptions | NonNullable<HTMLWebpackPluginOptions['template']>
        copyFiles?: CopyWebpackPluginOptions['patterns'] | string
        sassResources?: string
        include?: string[]
        exclude?: string[]
    }
    output?: {
        target?: string
        publicPath?: NonNullable<WebpackConfig['output']>['publicPath']
        filenames?: {
            PROD?: FilenamesProd
            DEV?: FilenamesCommon
        }
    }
    eslint?: boolean
    aliases?: Indexable<string>
    plugins?: Plugins
    modules?: Modules
    postProcessWebpackConfig?: (
        webpackConfig: WebpackConfig,
        config: ConfigFinal,
        buildConstants: BuildConstants
    ) => WebpackConfig
}


type NonNullInput = Required<NonNullable<BuildConfig['input']>>
type NonNullOutput = Required<NonNullable<BuildConfig['output']>>

type BuildConfigDefault = {
    input: {
        html: NonNullable<HTMLWebpackPluginOptions['template']>
        js: NonNullInput['js']
        include?: NonNullInput['include']
    }
    output: {
        publicPath: NonNullOutput['publicPath']
        target: NonNullOutput['target']
        filenames: NonNullable<NonNullOutput['filenames']>
    }
    eslint: NonNullable<BuildConfig['eslint']>
    aliases: NonNullable<BuildConfig['aliases']>
}


type BuildConfigsMerged = BuildConfig & BuildConfigDefault
type BuildConfigsOutputsMerged = BuildConfig['output'] & BuildConfigDefault['output']

type BuildConfigFinal = {
    input: BuildConfigsMerged['input']
    output: {
        target: BuildConfigsOutputsMerged['target']
        publicPath: BuildConfigsOutputsMerged['publicPath']
        filenames: NonNullable<BuildConfigsOutputsMerged['filenames']['DEV' | 'PROD']>
    }
    eslint: BuildConfigsMerged['eslint']
    aliases: BuildConfigsMerged['aliases']
    plugins?: BuildConfigsMerged['plugins']
    modules?: BuildConfigsMerged['modules']
    postProcessWebpackConfig?: BuildConfigsMerged['postProcessWebpackConfig']
}


export type {
    BuildConstants,
    BuildConfig, BuildConfigDefault, BuildConfigFinal, BuildConfigsMerged,
    FilenamesCommon, FilenamesProd
}