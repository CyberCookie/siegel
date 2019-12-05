const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const HTMLPlugin = require('html-webpack-plugin')
const fileCopyPlugin = require('copy-webpack-plugin')
const compression = require('compression-webpack-plugin')
const cssSVG = require('iconfont-webpack-plugin')
const autoprefixer = require('autoprefixer')
const cssMinifier = require('cssnano')
const miniCssExtract = require('mini-css-extract-plugin')
const config = require('./config')

const { input, output, aliases, publicPath } = config.build;

var WEBPACK_COMPILLER;


function getWebpackConfig({ isProd, isServer }) {
    const CSSExtract = (isProd || !isServer) && miniCssExtract;

    return {
        mode: process.env.NODE_ENV || 'development',
        cache: isServer,
        devtool: isProd ? '' : 'cheap-module-eval-source-map',
        resolve: {
            alias: aliases,
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.sass']
        },
        entry: [
            input.js,
            ...( isServer ? ['webpack-hot-middleware/client?reload=true&noInfo=true&quiet=true'] : [] )
        ],
        output: {
            publicPath,
            path: output.loc,
            chunkFilename: 'chunk.[contenthash].js',
            filename: isProd ? 'app.[contenthash].js' : 'app.js',
        },
        plugins : [
            new fileCopyPlugin([
                { from: input.assets.images, to: output.assets + '/images' },
                { from: input.assets.sw, to: output.loc },
                { from: input.assets.pwa, to: output.assets + '/pwa' }
            ]),
            ...( CSSExtract ? [ new CSSExtract({ filename: `styles.[contenthash].css`}) ] : [] ),
            new HTMLPlugin({ template: input.html }),
            ...( isServer ? [ new webpack.HotModuleReplacementPlugin() ] : [] ),

            // ...(
            //     isProd
            //         ?   [new compression({
            //                 test: /\.(js|css|html|woff2|ico|png)$/,
            //                 filename: '[path].br[query]',
            //                 algorithm: 'brotliCompress',
            //                 compressionOptions: {
            //                     level: 11
            //                 },
            //                 threshold: 10240,
            //                 minRatio: 0.8,
            //                 deleteOriginalAssets: false
            //             })]
            //         :   []
            //     )
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
                ...(
                    isProd
                        ?   []
                        :   [{
                                test: /\.(js|jsx|ts|tsx)$/,
                                use: 'react-hot-loader/webpack',
                                include: /node_modules/
                            }]
                ),

                {
                    test: /\.sass$/,
                    include: input.include,
                    exclude: input.exclude,
                    use: [
                        CSSExtract ? CSSExtract.loader : 'style-loader',
                        
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

                        // uses with css modules
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


module.exports = {
    run: options => {
        const webpackConfig = getWebpackConfig(options);
        WEBPACK_COMPILLER = webpack(webpackConfig);

        if (!options.isServer) {
            WEBPACK_COMPILLER.run((err, stats) => {
                let errMsg = err || (
                    stats.hasErrors()
                        ?   stats.compilation.errors
                        :   stats.toString({ colors: true })
                )

                console.log(errMsg)
            })
        }
    },

    getDevMiddlewares: () => ({
        dev: webpackDevMiddleware(WEBPACK_COMPILLER, {
            publicPath,
            hot: true,
            stats: {
                colors: true,
                chunks: false,
                hash: false,
                modules: false,
                children: false
            }
        }),

        hot: webpackHotMiddleware(WEBPACK_COMPILLER)
    })
}