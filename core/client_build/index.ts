import path from 'path'

import { PATHS, IS_SELF_DEVELOPMENT } from '../constants.js'
import * as BUILD_CONSTANTS from './constants.js'
import defaultModuleRulesResolve from './module_rules'
import defaultPluginsResolve from './plugins'

import type { Compiler, Configuration } from 'webpack'
import type { IncomingMessage, ServerResponse } from 'http'
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


    const nodeModulesPaths = [ PATHS.NODE_MODULES ]
    IS_SELF_DEVELOPMENT || nodeModulesPaths.push(PATHS.USER_NODE_MODULES)

    const isDevServer = isServer && !isProd


    let webpackCompiller: Compiler

    let webpackConfig: Configuration = {
        mode: isProd
            ?   'production'
            :   (process.env.NODE_ENV as Configuration['mode']) || 'development',

        cache: isDevServer,

        devtool: isProd
            ?   'hidden-source-map'
            :   'eval-cheap-module-source-map',

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
                        // terserOptions: {
                        //     'compress': {
                        //         'topLevel': true,
                        //         'passes': 3,
                        //         'reduce_vars': false,
                        //         'drop_console': true
                        //     },
                        //     'mangle': {
                        //         'topLevel': true
                        //     }
                        // }
                    })
                ]
            } : {})
        },

        plugins: defaultPluginsResolve(config)
            .map(({ plugin, options }) => new plugin(options)),

        module: {
            unsafeCache: true,
            rules: defaultModuleRulesResolve(config)
        }
    }


    const moduleOptions = build!.module?.moduleOptions
    moduleOptions && Object.assign(webpackConfig.module!, moduleOptions)

    if (typeof postProcessWebpackConfig === 'function') {
        webpackConfig = postProcessWebpackConfig(webpackConfig, config, BUILD_CONSTANTS)
    }


    return {
        run: () => new Promise<void>(resolve => {
            webpackCompiller = webpack(webpackConfig)!

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

        getWebpackCompiller: () => webpackCompiller,

        getDevMiddlewares: () => ({
            dev: devMiddleware(webpackCompiller, {
                stats: logging,
                forwardError: true
            }),

            hot: hotMiddleware(webpackCompiller as any),

            indexFallback(req: IncomingMessage, res: ServerResponse, next: () => void) {
                const { method, headers } = req
                if (method === 'GET' && headers.accept?.includes('text/html')) {
                    const { outputPath, outputFileSystem } = webpackCompiller

                    const filename = path.join(outputPath, 'index.html')
                    outputFileSystem!.readFile(filename, (_, result) => {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'text/html')
                        res.end(result)
                    })

                } else next()
            }
        })
    }
}


export { BUILD_CONSTANTS, clientBuilder }
export type WebpackMiddlewares = ReturnType<
    ReturnType<typeof clientBuilder>['getDevMiddlewares']
>