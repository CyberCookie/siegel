import { PATHS } from '../constants.js'
import * as BUILD_CONSTANTS from './constants.js'
import defaultModulesResolve from './modules'
import defaultPluginsResolve from './plugins'


const {
    DEPENDENCIES: { webpack, devMiddleware, hotMiddleware, esBuildMinifyPlugin },
    COMMONS: { ESLintExtensions }
} = BUILD_CONSTANTS

const statsOptions = {
    colors: true,
    modules: false,
    children: false
}


function clientBuilder(CONFIG: any, RUN_PARAMS: any) {
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


    let webpackCompiller: any

    let webpackConfig: any = {
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
        run: () => new Promise((resolve: any) => {
            webpackCompiller = webpack(webpackConfig)

            if (_isDevServer) resolve()
            else {
                webpackCompiller.run((err: any, stats: any) => {
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
export { BUILD_CONSTANTS }