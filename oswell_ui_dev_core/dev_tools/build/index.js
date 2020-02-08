const webpack               = require('webpack')
const webpackDevMiddleware  = require('webpack-dev-middleware')
const webpackHotMiddleware  = require('webpack-hot-middleware')
const terserPlugin          = require('terser-webpack-plugin')

const defaultPluginsResolve = require('./plugins')
const defaultModulesResolve = require('./modules')


function getWebpackConfig(CONFIG, RUN_PARAMS) {
    const { input, output, aliases = {}, publicPath, postProcessWebpackConfig } = CONFIG.build;
    const { isProd, isDevServer } = RUN_PARAMS;

    aliases['react-dom'] = '@hot-loader/react-dom'


    let webpackConfig = {
        mode: process.env.NODE_ENV || 'development',
        cache: isDevServer,
        devtool: isProd ? '' : 'cheap-module-eval-source-map',
        resolve: {
            alias: aliases,
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.sass']
        },
        entry: [
            ...( isDevServer ? ['webpack-hot-middleware/client?reload=true&noInfo=true&quiet=true'] : [] ),
            input.js
        ],
        output: {
            publicPath,
            path: output.loc,
            chunkFilename: 'chunk.[contenthash].js',
            filename: isProd ? 'app.[contenthash].js' : 'app.js',
        },

        ...( isProd
            ?   {
                    optimization: {
                        minimizer: [
                            new terserPlugin({
                                terserOptions: {
                                    output: { comments: false }
                                },
                                extractComments: false
                            })
                        ]
                    }
                }
            :   {}
        ),

        
        plugins: defaultPluginsResolve(CONFIG, RUN_PARAMS),
        module: { rules: defaultModulesResolve(CONFIG, RUN_PARAMS) }
    }
    
    if (typeof postProcessWebpackConfig == 'function') {
        webpackConfig = postProcessWebpackConfig.call(CONFIG, webpackConfig)
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
        const webpackConfig = getWebpackConfig(CONFIG, RUN_PARAMS);
        const webpackCompiller = webpack(webpackConfig);

        if (!RUN_PARAMS.isDevServer) {
            webpackCompiller.run((err, stats) => {
                let message = err || (
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
        dev: webpackDevMiddleware(webpackCompiller, {
            publicPath: CONFIG.build.publicPath,
            hot: true,
            stats: statsOptions
        }),

        hot: webpackHotMiddleware(webpackCompiller)
    })
}