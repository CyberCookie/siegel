const { PATHS } = require('../constants');
const { DEPENDENCIES } = require('./constants');
const defaultModulesResolve = require('./modules');
const defaultPluginsResolve = require('./plugins');
const { DEPENDENCIES: { webpack, devMiddleware, hotMiddleware, esBuildMinifyPlugin }, COMMONS: { ESLintExtensions } } = require('./constants');
function getWebpackConfig(CONFIG, RUN_PARAMS) {
    const { isProd, isDevServer } = RUN_PARAMS;
    const { staticDir, build } = CONFIG;
    const { input, aliases, publicPath, postProcessWebpackConfig } = build;
    let webpackConfig = {
        mode: process.env.NODE_ENV || 'development',
        cache: isDevServer,
        ...(isProd ? {} : {
            devtool: 'eval-cheap-module-source-map'
        }),
        resolve: {
            unsafeCache: true,
            alias: aliases,
            extensions: ESLintExtensions.concat(['.sass', '.d.ts']),
            modules: [PATHS.nodeModules, PATHS.parentNodeModules]
        },
        entry: [
            ...(isDevServer ? ['webpack-hot-middleware/client?reload=true&noInfo=true&quiet=true'] : []),
            input.js
        ],
        output: {
            publicPath,
            path: staticDir,
            pathinfo: false,
            chunkFilename: 'chunk.[contenthash].js',
            filename: 'app.[contenthash].js',
        },
        optimization: {
            splitChunks: {
                chunks: 'all'
            },
            ...(isProd ? {
                minimizer: [
                    new esBuildMinifyPlugin({
                        target: 'esnext',
                        css: true
                    })
                ]
            } : {})
        },
        plugins: defaultPluginsResolve(CONFIG, RUN_PARAMS),
        module: defaultModulesResolve(CONFIG, RUN_PARAMS)
    };
    if (typeof postProcessWebpackConfig == 'function') {
        webpackConfig = postProcessWebpackConfig.call(CONFIG, webpackConfig, DEPENDENCIES);
    }
    return webpackConfig;
}
const statsOptions = {
    colors: true,
    modules: false,
    children: false
};
module.exports = {
    run: (CONFIG, RUN_PARAMS) => new Promise(resolve => {
        const webpackConfig = getWebpackConfig(CONFIG, RUN_PARAMS);
        const webpackCompiller = webpack(webpackConfig);
        if (!RUN_PARAMS.isDevServer) {
            webpackCompiller.run((err, stats) => {
                const message = err || (stats.hasErrors()
                    ? stats.compilation.errors
                    : stats.toString(statsOptions));
                console.log(message);
                resolve(webpackCompiller);
            });
        }
        else
            resolve(webpackCompiller);
    }),
    getDevMiddlewares: (CONFIG, webpackCompiller) => ({
        dev: devMiddleware(webpackCompiller, {
            publicPath: CONFIG.build.publicPath,
            stats: statsOptions
        }),
        hot: hotMiddleware(webpackCompiller)
    })
};
