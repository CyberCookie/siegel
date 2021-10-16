import type { Configuration } from 'webpack'


const BUILD_CONSTANTS               = require('./constants')
const defaultModulesResolve         = require('./modules')
const defaultPluginsResolve         = require('./plugins')


const {
    DEPENDENCIES: { webpack, devMiddleware, hotMiddleware, esBuildMinifyPlugin },
    COMMONS: { ESLintExtensions }
} = BUILD_CONSTANTS


function getWebpackConfig(CONFIG, RUN_PARAMS) {
    const { isProd, isDevServer } = RUN_PARAMS
    const { staticDir, build } = CONFIG
    const { input, aliases, publicPath, postProcessWebpackConfig/*, outputESM = true*/ } = build


    let webpackConfig: Configuration = {
        mode: isProd
            ?   'production'
            :   (process.env.NODE_ENV as Configuration['mode']) || 'development',

        cache: isDevServer,

        devtool: !isProd && 'eval-cheap-module-source-map',

        resolve: {
            unsafeCache: true,
            alias: aliases,
            extensions: ESLintExtensions.concat(['.sass', '.css', '.d.ts'])
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
            hashFunction: 'xxhash64'

            // ...( outputESM ? {
            //     module: true,
            //     library: {
            //         type: 'module'
            //     }
            // } : {})
        },

        experiments: {
            cacheUnaffected: true

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
                        target: 'esnext',
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


    return webpackConfig
}


const statsOptions = {
    colors: true,
    modules: false,
    children: false
}


module.exports = {
    run: (CONFIG, RUN_PARAMS) => new Promise(resolve => {
        const webpackConfig = getWebpackConfig(CONFIG, RUN_PARAMS)
        const webpackCompiller = webpack(webpackConfig)

        if (!RUN_PARAMS.isDevServer) {
            webpackCompiller.run((err, stats) => {
                const message = err || (
                    stats.hasErrors()
                        ?   stats.compilation.errors
                        :   stats.toString(statsOptions)
                )

                console.log(message)
                resolve(webpackCompiller)
            })
        } else resolve(webpackCompiller)
    }),

    getDevMiddlewares: (CONFIG, webpackCompiller) => ({
        dev: devMiddleware(webpackCompiller, {
            publicPath: CONFIG.build.publicPath,
            stats: statsOptions
        }),

        hot: hotMiddleware(webpackCompiller)
    })
}
export {}