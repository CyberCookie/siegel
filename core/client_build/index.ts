import { PATHS } from '../constants.js'
import * as BUILD_CONSTANTS from './constants.js'
import defaultModulesResolve from './modules'
import defaultPluginsResolve from './plugins'

import type { Compiler, Configuration } from 'webpack'
import type { ConfigFinal, RunParamsFinal } from '../types'


const {
    DEPENDENCIES: { webpack, devMiddleware, hotMiddleware, esBuildMinifyPlugin },
    COMMONS: { ESLintExtensions }
} = BUILD_CONSTANTS

const statsOptions = {
    colors: true,
    modules: false,
    children: false
}


function clientBuilder(CONFIG: ConfigFinal, RUN_PARAMS: RunParamsFinal) {
    const { isProd, _isDevServer, _isSelfDevelopment } = RUN_PARAMS
    const {
        publicDir,
        build: {
            output: { target, publicPath, filenames },
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
            topLevelAwait: true,
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
                minimizer: [ new esBuildMinifyPlugin({ target }) ]
            } : {})
        },

        plugins: defaultPluginsResolve(CONFIG, RUN_PARAMS),
        module: {
            unsafeCache: true,
            rules: defaultModulesResolve(CONFIG, RUN_PARAMS)
        }
    }

    if (typeof postProcessWebpackConfig == 'function') {
        webpackConfig = postProcessWebpackConfig(webpackConfig, CONFIG, BUILD_CONSTANTS)
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
                            :   stats!.toString(statsOptions)
                    )
                    console.log(message)

                    resolve()
                })
            }
        }),

        getDevMiddlewares: () => ({
            dev: devMiddleware(webpackCompiller, {
                stats: statsOptions
            }),
            hot: hotMiddleware(webpackCompiller)
        })
    }
}


export default clientBuilder
export { BUILD_CONSTANTS }