"use strict";
//TODO: place 'theme = true' into a bundle if css modules enabled
Object.defineProperty(exports, "__esModule", { value: true });
const { loadersKeyMap, webpackModulesRegExp, DEPENDENCIES: { plugins: { miniCssExtract }, loaders: { esbuild, styleLoader, cssLoader, sassLoader, sassResourcesLoader, postCssLoader, postCssAutoprefix, postCssSVG2Font } } } = require('../constants');
module.exports = (CONFIG, RUN_PARAMS) => {
    const { sassResources, include, exclude } = CONFIG.build.input;
    const { isProd, isServer } = RUN_PARAMS;
    const defaults = {
        [webpackModulesRegExp.scripts]: {
            loadersOrder: [loadersKeyMap.esbuild],
            loaders: {
                [loadersKeyMap.esbuild]: {
                    loader: esbuild,
                    options: {
                        loader: 'tsx',
                        target: 'es2015'
                    }
                }
            }
        },
        [webpackModulesRegExp.styles]: {
            loadersOrder: [loadersKeyMap.cssFinal, loadersKeyMap.cssLoader, loadersKeyMap.postCssLoader, loadersKeyMap.sassLoader, loadersKeyMap.sassResources],
            loaders: {
                [loadersKeyMap.cssFinal]: isProd || !isServer
                    ? miniCssExtract.loader
                    : styleLoader,
                [loadersKeyMap.cssLoader]: {
                    loader: cssLoader,
                    options: {
                        sourceMap: !isProd,
                        url: false,
                        importLoaders: 3,
                        modules: {
                            localIdentName: isProd ? '[hash:base64:4]' : '[local]--[hash:base64:4]'
                        }
                    }
                },
                [loadersKeyMap.postCssLoader]: {
                    loader: postCssLoader,
                    options: {
                        sourceMap: !isProd,
                        postcssOptions: {
                            plugins: [
                                [postCssAutoprefix, { overrideBrowserList: 'last 1 version' }],
                                [postCssSVG2Font, {
                                        woff2: isProd,
                                        fontNamePrefix: ''
                                    }]
                            ]
                        }
                    }
                },
                [loadersKeyMap.sassLoader]: {
                    loader: sassLoader,
                    options: {
                        sourceMap: !isProd
                    }
                },
                [loadersKeyMap.sassResources]: {
                    loader: sassResourcesLoader,
                    options: {
                        resources: sassResources
                    }
                }
            }
        }
    };
    for (const regexpPart in defaults) {
        defaults[regexpPart].ruleOptions = { include, exclude };
    }
    return defaults;
};
