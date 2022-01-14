"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { PATHS } = require('../../constants');
const { loadersKeyMap, webpackModulesRegExp, DEPENDENCIES: { plugins: { miniCssExtract }, loaders: { esbuild, cssLoader, sassLoader, styleLoader, sassResourcesLoader, postCssLoader, postCssAutoprefix, postCssSVG2Font } } } = require('../constants');
module.exports = (CONFIG, RUN_PARAMS) => {
    var _a;
    const { output: { target }, input: { sassResources, include, exclude } } = CONFIG.build;
    const { isProd, isServer } = RUN_PARAMS;
    const isDev = !isProd;
    const defaults = {
        [webpackModulesRegExp.scripts]: {
            loadersOrder: [loadersKeyMap.esbuild],
            loaders: {
                [loadersKeyMap.esbuild]: {
                    loader: esbuild,
                    options: {
                        target,
                        loader: 'tsx'
                    }
                }
            }
        },
        [webpackModulesRegExp.styles]: {
            loadersOrder: [
                loadersKeyMap.cssFinal, loadersKeyMap.cssLoader, loadersKeyMap.postCssLoader,
                loadersKeyMap.sassLoader, loadersKeyMap.sassResources
            ],
            loaders: {
                [loadersKeyMap.cssFinal]: isProd || !isServer
                    ? miniCssExtract.loader
                    : styleLoader,
                [loadersKeyMap.cssLoader]: {
                    loader: cssLoader,
                    options: {
                        sourceMap: isDev,
                        // url: url => !url.endsWith('.svg'),
                        importLoaders: 2,
                        modules: {
                            localIdentName: isProd
                                ? '[hash:base64:4]'
                                : '[local]--[hash:base64:4]'
                        }
                    }
                },
                [loadersKeyMap.postCssLoader]: {
                    loader: postCssLoader,
                    options: {
                        sourceMap: isDev,
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
                        sourceMap: isDev
                    }
                },
                [loadersKeyMap.sassResources]: {
                    loader: sassResourcesLoader,
                    options: {
                        resources: sassResources
                    }
                }
            },
            ...(!RUN_PARAMS._isSelfDevelopment ? {
                ruleOptions: {
                    include: [PATHS.clientCoreOutput]
                }
            } : {})
        },
        [webpackModulesRegExp.files]: {
            ruleOptions: {
                type: 'asset/resource'
            }
        }
    };
    for (const regexpPart in defaults) {
        (_a = defaults[regexpPart]).ruleOptions || (_a.ruleOptions = {});
        const { ruleOptions } = defaults[regexpPart];
        const { include: _include, exclude: _exclude } = ruleOptions;
        ruleOptions.include = _include && include
            ? _include.concat(include)
            : _include || include,
            ruleOptions.exclude = _exclude && exclude
                ? _exclude.concat(exclude)
                : _exclude || exclude;
    }
    return defaults;
};
