import type { Configuration, Compiler } from 'webpack'


const { DEFAULT_CONFIG, PATHS }     = require('../constants')
const BUILD_CONSTANTS               = require('./constants')
const defaultModulesResolve         = require('./modules')
const defaultPluginsResolve         = require('./plugins')



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
    const { isProd, isDevServer } = RUN_PARAMS
    const { staticDir, build } = CONFIG
    const { input, aliases, publicPath, postProcessWebpackConfig/*, outputESM = true*/ } = build

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
            extensions: ESLintExtensions.concat(['.sass', '.css', '.d.ts']),
            modules: [ PATHS.nodeModules, PATHS.globalNodeModules ]
        },

        entry: [
            ...( isDevServer ? ['webpack-hot-middleware/client?reload=true&noInfo=true&quiet=true'] : [] ),
            input.js
        ],

        output: {
            publicPath,
            path: staticDir,
            pathinfo: false,
            chunkFilename: 'chunk.[contenthash].js',
            filename: 'app.[contenthash].js',
            assetModuleFilename: isProd
                ?   'assets/[name][contenthash].[ext]'
                :   'assets/[name].[ext]',
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
                        target: DEFAULT_CONFIG.build.target,
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
        run: () => new Promise<void>(resolve => {
            webpackCompiller = webpack(webpackConfig)

            if (isDevServer) resolve()
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


module.exports = clientBuilder
export {}