//TODO: place 'theme = true' into a bundle if css modules enabled


const resolve = require.resolve

const {
    loadersKeyMap, webpackModulesRegExp,

    DEPENDENCIES: {
        plugins: { miniCssExtract },
        resolvedLoaders: {
            babelPresetEnv, babelPresetReact, babelPresetTS,
            babelPluginReactRefresh, babelPluginExportDefault, babelPluginExportNamespace, babelPluginDynamicImport, babelPluginTransformRuntime,
            babelPluginLogicalAssignment, babelPluginOptionalChaining,
            postCssAutoprefix, postCssSVG2Font
        }
    }
} = require('../constants')


module.exports = (CONFIG, RUN_PARAMS) => {
    const { sassResources, include, exclude } = CONFIG.build.input
    const { isProd, isServer } = RUN_PARAMS


    const defaults = {
        [webpackModulesRegExp.scripts]: {
            loaderOrder: [ loadersKeyMap.babel, loadersKeyMap.eslint ],
            loaders: {
                [ loadersKeyMap.babel ]: {
                    loader: resolve('babel-loader'),
                    options: {
                        cacheDirectory: true,
                        presets: [
                            [ babelPresetEnv, {
                                targets: 'last 1 chrome version',
                                shippedProposals: true
                            }],
                            babelPresetReact,
                            babelPresetTS
                        ],
                        plugins: [
                            ...( isProd ? [] : [ babelPluginReactRefresh ]),
                            babelPluginExportDefault,
                            babelPluginExportNamespace,
                            babelPluginDynamicImport,
                            babelPluginTransformRuntime,
                            babelPluginLogicalAssignment,
                            babelPluginOptionalChaining
                        ]
                    }
                }
            }
        },

        [ webpackModulesRegExp.styles ]: {
            loaderOrder: [ loadersKeyMap.cssFinal, loadersKeyMap.cssLoader, loadersKeyMap.postCssLoader, loadersKeyMap.sassLoader, loadersKeyMap.sassResources ],
            loaders: {
                [loadersKeyMap.cssFinal]: isProd || !isServer
                    ?   miniCssExtract.loader
                    :   resolve('style-loader'),

                [loadersKeyMap.cssLoader]: {
                    loader: resolve('css-loader'),
                    options: {
                        sourceMap: !isProd,
                        url: false,
                        importLoaders: 3,
                        modules: {
                            localIdentName: isProd ? '[hash:base64:4]' : '[local]--[hash:base64:4]'
                        }
                    }
                },

                [ loadersKeyMap.postCssLoader ]: {
                    loader: resolve('postcss-loader'),
                    options: {
                        sourceMap: !isProd,
                        postcssOptions: {
                            plugins: [
                                [ postCssAutoprefix, { overrideBrowserList: 'last 1 version' } ],
                                [ postCssSVG2Font, {
                                    woff2: isProd,
                                    fontNamePrefix: ''
                                }]
                            ]
                        }
                    }
                },

                [ loadersKeyMap.sassLoader ]: {
                    loader: resolve('sass-loader'),
                    options: {
                        sourceMap: !isProd
                    }
                },

                [ loadersKeyMap.sassResources ]: {
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