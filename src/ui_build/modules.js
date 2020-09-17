// const cssSVG                = require('iconfont-webpack-plugin')
const autoprefixer          = require('autoprefixer')
const cssMinifier           = require('cssnano')
const miniCssExtract        = require('mini-css-extract-plugin')

const resolve = require.resolve;


function getModules(CONFIG, RUN_PARAMS) {
    const { sassResources, include } = CONFIG.build.input;
    const { isProd, isServer } = RUN_PARAMS;


    return { rules: [
        {
            test: /\.(js|jsx|ts|tsx)$/,
            include,
            use: [
                {
                    loader: resolve('babel-loader'),
                    options: {
                        cacheDirectory: true,
                        presets: [
                            resolve('@babel/preset-react'),
                            resolve('@babel/preset-typescript')
                        ],
                        plugins: [
                            resolve('@babel/plugin-proposal-export-default-from'),
                            resolve('@babel/plugin-proposal-export-namespace-from'),
                            resolve('@babel/plugin-syntax-dynamic-import'),
                            ...( isProd ? [] : [ resolve('react-refresh/babel') ])
                        ]
                    }
                },
                {
                    loader: resolve('eslint-loader'),
                    options: {
                        emitWarning: true
                    }
                }
            ]
        },

        {
            test: /\.sass$/,
            include,
            use: [
                isProd || !isServer ? miniCssExtract.loader : resolve('style-loader'),
                
                {
                    loader: resolve('css-loader'),
                    options: {
                        sourceMap: !isProd,
                        importLoaders: 3,
                        url: url => url.endsWith('.svg'),
                        modules: {
                            localIdentName: isProd ? '[hash:base64:4]' : '[local]--[hash:base64:4]'
                        }
                    }
                },

                {
                    loader: resolve('postcss-loader'),
                    options: {
                        sourceMap: !isProd,
                        // postcssOptions: {
                        //     plugins: [
                        //         [ require.resolve('autoprefixer'), { overrideBrowserList: 'last 1 version' } ],
                        //         [ require.resolve('cssnano'), { preset: 'default' } ]
                        //     ]
                        // }
                        plugins: (/*loader*/) => [
                            autoprefixer({ overrideBrowserList: 'last 1 version' }),
                            cssMinifier({ preset: 'default' })
                            // TODO:
                            // new cssSVG(loader)
                        ]
                    }
                },

                {
                    loader: resolve('sass-loader'),
                    options: {
                        sourceMap: !isProd
                    }
                },

                // use with css modules
                {
                    loader: resolve('sass-resources-loader'),
                    options: {
                        resources: sassResources
                    }
                }
            ]
        }
    ]}
}


module.exports = getModules