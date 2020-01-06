const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const HTMLPlugin = require('html-webpack-plugin')
const fileCopyPlugin = require('copy-webpack-plugin')
const compressionPlugin = require('compression-webpack-plugin')
const cssSVG = require('iconfont-webpack-plugin')
const autoprefixer = require('autoprefixer')
const cssMinifier = require('cssnano')
const miniCssExtract = require('mini-css-extract-plugin')



function getWebpackConfig(CONFIG, RUN_PARAMS) {
    const { input, output, aliases, publicPath } = CONFIG.build;
    const { isProd, isServer, isDevServer } = RUN_PARAMS;

    const isExtractCSS = isProd || !isServer;


    return {
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
        plugins: [
            new fileCopyPlugin([
                { from: input.assets.images, to: output.assets + '/images' },
                { from: input.assets.sw, to: output.loc },
                { from: input.assets.pwa, to: output.assets + '/pwa' }
            ]),

            ...( isExtractCSS ? [ new miniCssExtract({ filename: `styles.[hash].css`}) ] : [] ),

            new HTMLPlugin({
                template: input.html,
                minify: true
            }),

            // new webpack.HotModuleReplacementPlugin(),
            // ...( isDevServer ? [ new webpack.HotModuleReplacementPlugin() ] : [] ),
            ...( isProd ? [] : [ new webpack.HotModuleReplacementPlugin() ] ),

            ...(
                isProd
                    ?   [
                            new compressionPlugin({
                                test: /\.*$/,
                                filename: '[path].br[query]',
                                algorithm: 'brotliCompress',
                                compressionOptions: {
                                    level: 11
                                },
                                threshold: 10240
                                // deleteOriginalAssets: true
                            }),

                            new compressionPlugin({
                                test: /\.*$/,
                                filename: '[path].gz[query]',
                                threshold: 10240
                                // deleteOriginalAssets: true
                            })
                        ]
                    :   []
                )
        ],

        module: {   
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    include: input.include,
                    exclude: input.exclude,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                presets: ['@babel/preset-react', '@babel/typescript'],
                                plugins: [
                                    'react-hot-loader/babel',
                                    '@babel/plugin-proposal-export-default-from',
                                    '@babel/plugin-proposal-export-namespace-from',
                                    '@babel/plugin-syntax-dynamic-import',
                                    // ['@babel/plugin-proposal-decorators', { legacy: true }],
                                    ['@babel/plugin-proposal-class-properties', { loose: true }]
                                ]
                            }
                        },
                        {
                            loader: 'eslint-loader',
                            options: {
                                emitWarning: true,
                                // eslintPath: __dirname
                            }
                        }
                    ]
                },

                // ...(
                //     isDevServer
                //         ?   [{
                //                 test: /\.(js|jsx|ts|tsx)$/,
                //                 use: 'react-hot-loader/webpack',
                //                 include: /node_modules/
                //             }]
                //         :   []
                // ),


                {
                    test: /\.sass$/,
                    include: input.include,
                    exclude: input.exclude,
                    use: [
                        isExtractCSS ? miniCssExtract.loader : 'style-loader',
                        
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: !isProd,
                                importLoaders: 2,
                                modules: {
                                    localIdentName: isProd ? '[hash:base64:4]' : '[local]--[hash:base64:4]'
                                }
                            }
                        },
                        
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: !isProd,
                                plugins: loader => [
                                    new cssSVG(loader),
                                    autoprefixer({ overrideBrowserList: 'last 1 version' }),
                                    cssMinifier({ preset: 'default' })
                                ]
                            }
                        },

                        {
                            loader: 'sass-loader',
                            options: { sourceMap: !isProd }
                        },

                        // use with css modules
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: input.sassResources
                            }
                        }
                    ]
                },

                {
                    // test: /\.(woff2|ico|png|jpg)$/,
                    test: /\.woff2$/,
                    include: input.include,
                    exclude: input.exclude,
                    loader: 'file-loader',
                    options: { 
                        name: input.assets.assetsFolderName + '/[folder]/[name].[ext]'
                    }
                }
            ]
        }
    }
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