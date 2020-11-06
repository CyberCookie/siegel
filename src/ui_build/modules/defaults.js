// const cssSVG         = require('iconfont-webpack-plugin')
const miniCssExtract                            = require('mini-css-extract-plugin')
const { loadersKeyMap, webpackModulesRegExp }   = require('../constants')

const resolve = require.resolve;


module.exports = (CONFIG, RUN_PARAMS) => {
    const { sassResources, include, exclude } = CONFIG.build.input;
    const { isProd, isServer } = RUN_PARAMS;


    const defaults = {
        [webpackModulesRegExp.scripts]: {
            loaderOrder: [loadersKeyMap.babel, loadersKeyMap.eslint],
            loaders: {
                [loadersKeyMap.babel]: {
                    loader: resolve('babel-loader'),
                    options: {
                        cacheDirectory: true,
                        presets: [
                            [ resolve('@babel/preset-env'), {
                                targets: "last 1 chrome version",
                                shippedProposals: true
                            }],
                            resolve('@babel/preset-react'),
                            resolve('@babel/preset-typescript')
                        ],
                        plugins: [
                            ...( isProd ? [] : [ resolve('react-refresh/babel') ]),
                            resolve('@babel/plugin-proposal-export-default-from'),
                            resolve('@babel/plugin-proposal-export-namespace-from'),
                            resolve('@babel/plugin-syntax-dynamic-import'),
                            resolve('@babel/plugin-transform-runtime'),
                            resolve('@babel/plugin-proposal-logical-assignment-operators'),
                            resolve('@babel/plugin-proposal-optional-chaining')
                        ]
                    }
                },

                [loadersKeyMap.eslint]: {
                    loader: resolve('eslint-loader'),
                    options: {
                        emitWarning: true
                    }
                }
            }
        },

        [webpackModulesRegExp.styles]: {
            loaderOrder: [loadersKeyMap.cssFinal, loadersKeyMap.cssLoader, loadersKeyMap.postCssLoader, loadersKeyMap.sassLoader, loadersKeyMap.sassResources],
            loaders: {
                [loadersKeyMap.cssFinal]: isProd || !isServer ? miniCssExtract.loader : resolve('style-loader'),

                [loadersKeyMap.cssLoader]: {
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

                [loadersKeyMap.postCssLoader]: {
                    loader: resolve('postcss-loader'),
                    options: {
                        sourceMap: !isProd,
                        postcssOptions: {
                            plugins: [
                                [ resolve('autoprefixer'), { overrideBrowserList: 'last 1 version' } ]
                            ]
                        }
                    }
                },

                [loadersKeyMap.sassLoader]: {
                    loader: resolve('sass-loader'),
                    options: {
                        sourceMap: !isProd
                    }
                },

                [loadersKeyMap.sassResources]: {
                    loader: resolve('sass-resources-loader'),
                    options: {
                        resources: sassResources
                    }
                }
            }
        }
    }
    for (let regexpPart in defaults) {
        defaults[regexpPart].ruleOptions = { include, exclude }
    }


    return defaults
}