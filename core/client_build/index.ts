import { PATHS, IS_SELF_DEVELOPMENT } from '../constants.js'
import * as BUILD_CONSTANTS from './constants.js'
import defaultModuleRulesResolve from './module_rules'
import defaultPluginsResolve from './plugins'

import type { Compiler, Configuration } from 'webpack'
import type { ConfigObject } from '../types'


const {
    DEPENDENCIES: {
        webpack, devMiddleware, hotMiddleware,
        plugins: { TerserWebpackPlugin, swcMinify }
    },
    COMMONS: { ESLintExtensions }
} = BUILD_CONSTANTS


function clientBuilder(config: ConfigObject) {
    const { publicDir, runMode, build } = config
    const { isProd, isServer } = runMode!
    const { input, aliases, postProcessWebpackConfig, output } = build!
    const { publicPath, filenames, logging } = output!

    const nodeModulesPaths = [ PATHS.nodeModules ]
    IS_SELF_DEVELOPMENT || nodeModulesPaths.push(PATHS.cwdNodeModules)

    const isDevServer = isServer && !isProd

    let webpackCompiller: Compiler


    let webpackConfig: Configuration = {
        mode: isProd
            ?   'production'
            :   (process.env.NODE_ENV as Configuration['mode']) || 'development',

        cache: isDevServer,

        devtool: !isProd && 'eval-cheap-module-source-map',

        resolve: {
            unsafeCache: true,
            alias: aliases,
            extensions: [ ...ESLintExtensions, '.sass', '.css', '.d.ts' ],
            modules: nodeModulesPaths
        },

        entry: [
            ...( isDevServer ? [ 'webpack-hot-middleware/client?reload=true&noInfo=true&quiet=true' ] : [] ),
            input!.js!
        ],

        output: {
            publicPath,
            path: publicDir,
            pathinfo: false,
            chunkFilename: filenames!.js_chunk,
            filename: filenames!.js,
            assetModuleFilename: filenames!.assets,
            hashFunction: 'xxhash64',
            clean: true

            // ,chunkFormat: 'module',
            // ,...( outputESM ? {
            //     module: true,
            //     library: {
            //         type: 'module'
            //     }
            // } : {})
        },

        experiments: {
            cacheUnaffected: true,
            backCompat: false,
            asyncWebAssembly: true
            // , ...( outputESM ? {
            //     outputModule: true
            // } : {})
        },

        optimization: {
            // sideEffects: false,
            // providedExports: false,
            splitChunks: {
                chunks: 'all'
            },
            ...( isProd ? {
                minimize: true,
                minimizer: [
                    new TerserWebpackPlugin({
                        minify: swcMinify
                    })
                ]
            } : {})
        },

        plugins: defaultPluginsResolve(config),
        module: {
            unsafeCache: true,
            rules: defaultModuleRulesResolve(config)
        }
    }

    const moduleOptions = build!.module?.moduleOptions
    moduleOptions && Object.assign(webpackConfig.module!, moduleOptions)

    if (typeof postProcessWebpackConfig == 'function') {
        webpackConfig = postProcessWebpackConfig(webpackConfig, config, BUILD_CONSTANTS)
    }


    return {
        run: () => new Promise<void>(resolve => {
            webpackCompiller = webpack(webpackConfig)

            if (isDevServer) resolve()
            else {
                webpackCompiller.run((err, stats) => {
                    const message = err || (
                        stats!.hasErrors()
                            ?   stats!.compilation.errors
                            :   stats!.toString(logging)
                    )
                    console.log(message)

                    resolve()
                })
            }
        }),

        getDevMiddlewares: () => ({
            dev: devMiddleware(webpackCompiller, {
                stats: logging
            }),
            hot: hotMiddleware(webpackCompiller)
        })
    }
}


export default clientBuilder
export { BUILD_CONSTANTS }