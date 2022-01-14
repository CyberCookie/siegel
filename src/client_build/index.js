import { PATHS } from '../constants.js'
import * as BUILD_CONSTANTS from './constants.js'
import defaultModulesResolve from './modules/index.js'
import defaultPluginsResolve from './plugins/index.js'


const {
    DEPENDENCIES: { webpack, devMiddleware, hotMiddleware, esBuildMinifyPlugin },
    COMMONS: { ESLintExtensions }
} = BUILD_CONSTANTS

const statsOptions = {
    colors: true,
    modules: false,
    children: false
}


function clientBuilder(CONFIG, RUN_PARAMS) {
    const { isProd, _isDevServer, _isSelfDevelopment } = RUN_PARAMS
    const {
        staticDir,
        build: {
            output: { target, publicPath, filenames },
            input, aliases, postProcessWebpackConfig//, outputESM = true
        }
    } = CONFIG

    const nodeModulesPaths = [ PATHS.nodeModules ]
    _isSelfDevelopment || nodeModulesPaths.push(PATHS.cwdNodeModules)


    let webpackCompiller

    let webpackConfig = {
        mode: isProd
            ?   'production'
            :   process.env.NODE_ENV || 'development',

        cache: _isDevServer,

        devtool: !isProd && 'eval-cheap-module-source-map',

        resolve: {
            unsafeCache: true,
            alias: aliases,
            extensions: ESLintExtensions.concat(['.sass', '.css', '.d.ts']),
            modules: nodeModulesPaths
        },

        entry: [
            ...( _isDevServer ? [ 'webpack-hot-middleware/client?reload=true&noInfo=true&quiet=true' ] : [] ),
            input.js
        ],

        output: {
            publicPath,
            path: staticDir,
            pathinfo: false,
            chunkFilename: filenames.js_chunk,
            filename: filenames.js,
            assetModuleFilename: filenames.assets,
            hashFunction: 'xxhash64'

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
                minimizer: [
                    new esBuildMinifyPlugin({
                        target,
                        css: true
                    })
                ]
            } : {})
        },

        plugins: defaultPluginsResolve(CONFIG, RUN_PARAMS),
        module: {
            unsafeCache: true,
            rules: defaultModulesResolve(CONFIG, RUN_PARAMS)
        }
    }

    if (typeof postProcessWebpackConfig == 'function') {
        webpackConfig = postProcessWebpackConfig.call(CONFIG, webpackConfig, BUILD_CONSTANTS)
    }


    return {
        run: () => new Promise(resolve => {
            webpackCompiller = webpack(webpackConfig)

            if (_isDevServer) resolve()
            else {
                webpackCompiller.run((err, stats) => {
                    const message = err || (
                        stats.hasErrors()
                            ?   stats.compilation.errors
                            :   stats.toString(statsOptions)
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