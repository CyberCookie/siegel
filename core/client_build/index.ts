import { PATHS } from '../constants.js'
import * as BUILD_CONSTANTS from './constants.js'
import defaultModuleRulesResolve from './module_rules'
import defaultPluginsResolve from './plugins'

import type { Compiler, Configuration } from 'webpack'
import type { ConfigFinal, RunParamsFinal } from '../types'


const {
    DEPENDENCIES: { webpack, devMiddleware, hotMiddleware, esBuildPlugin },
    COMMONS: { ESLintExtensions }
} = BUILD_CONSTANTS


function clientBuilder(CONFIG: ConfigFinal, RUN_PARAMS: RunParamsFinal) {
    const { isProd, _isDevServer, _isSelfDevelopment } = RUN_PARAMS
    const {
        publicDir,
        build: {
            output: { target, publicPath, filenames, logging },
            input, aliases, postProcessWebpackConfig//, outputESM = true
        }
    } = CONFIG

    const nodeModulesPaths = [ PATHS.nodeModules ]
    _isSelfDevelopment || nodeModulesPaths.push(PATHS.cwdNodeModules)

    let webpackCompiller: Compiler


    let webpackConfig: Configuration = {
        mode: isProd
            ?   'production'
            :   (process.env.NODE_ENV as Configuration['mode']) || 'development',

        cache: _isDevServer,

        devtool: !isProd && 'eval-cheap-module-source-map',

        resolve: {
            unsafeCache: true,
            alias: aliases,
            extensions: [ ...ESLintExtensions, '.sass', '.css', '.d.ts' ],
            modules: nodeModulesPaths
        },

        entry: [
            ...( _isDevServer ? [ 'webpack-hot-middleware/client?reload=true&noInfo=true&quiet=true' ] : [] ),
            input.js
        ],

        output: {
            publicPath,
            path: publicDir,
            pathinfo: false,
            chunkFilename: filenames.js_chunk,
            filename: filenames.js,
            assetModuleFilename: filenames.assets,
            hashFunction: 'xxhash64',
            clean: true

            // ...( outputESM ? {
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
            // ...( outputESM ? {
            //     outputModule: true
            // } : {})
        },

        optimization: {
            sideEffects: false,
            providedExports: false,
            splitChunks: {
                chunks: 'all'
            },

            ...( isProd ? {
                minimizer: [
                    new esBuildPlugin({
                        target,
                        legalComments: 'none',
                        css: true
                    })
                ]
            } : {})
        },

        plugins: defaultPluginsResolve(CONFIG, RUN_PARAMS),
        module: {
            unsafeCache: true,
            rules: defaultModuleRulesResolve(CONFIG, RUN_PARAMS)
        }
    }

    const moduleOptions = CONFIG.build.module?.moduleOptions
    moduleOptions && Object.assign(webpackConfig.module!, moduleOptions)

    if (typeof postProcessWebpackConfig == 'function') {
        webpackConfig = postProcessWebpackConfig(webpackConfig, CONFIG, BUILD_CONSTANTS, RUN_PARAMS)
    }


    return {
        run: () => new Promise<void>(resolve => {
            webpackCompiller = webpack(webpackConfig)

            if (_isDevServer) resolve()
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