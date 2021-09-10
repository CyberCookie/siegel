const {
    loadersKeyMap, webpackModulesRegExp,

    DEPENDENCIES: {
        plugins: { miniCssExtract },
        loaders: {
            esbuild, cssLoader, sassLoader, sassResourcesLoader,
            postCssLoader, postCssAutoprefix, postCssSVG2Font,
            fileLoader
        }
    }
} = require('../constants')


module.exports = (CONFIG, RUN_PARAMS) => {
    const { sassResources, include, exclude } = CONFIG.build.input
    const { isProd } = RUN_PARAMS

    const isDev = !isProd


    const defaults: any = {
        [ webpackModulesRegExp.scripts ]: {
            loadersOrder: [ loadersKeyMap.esbuild ],
            loaders: {
                [ loadersKeyMap.esbuild ]: {
                    loader: esbuild,
                    options: {
                        loader: 'tsx',
                        target: 'es2015'
                    }
                }
            }
        },

        [ webpackModulesRegExp.styles ]: {
            loadersOrder: [ loadersKeyMap.cssFinal, loadersKeyMap.cssLoader, loadersKeyMap.postCssLoader, loadersKeyMap.sassLoader, loadersKeyMap.sassResources ],
            loaders: {
                [ loadersKeyMap.cssFinal ]: miniCssExtract.loader,

                [ loadersKeyMap.cssLoader ]: {
                    loader: cssLoader,
                    options: {
                        sourceMap: isDev,
                        // url: url => !url.endsWith('.svg'),
                        importLoaders: 3,
                        modules: {
                            localIdentName: isProd ? '[hash:base64:4]' : '[local]--[hash:base64:4]'
                        }
                    }
                },

                [ loadersKeyMap.postCssLoader ]: {
                    loader: postCssLoader,
                    options: {
                        sourceMap: isDev,
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
                    loader: sassLoader,
                    options: {
                        sourceMap: isDev
                    }
                },

                [ loadersKeyMap.sassResources ]: {
                    loader: sassResourcesLoader,
                    options: {
                        resources: sassResources
                    }
                }
            }
        },

        [ webpackModulesRegExp.files ]: {
            loadersOrder: [ loadersKeyMap.fileLoader ],
            loaders: {
                [ loadersKeyMap.fileLoader ]: {
                    loader: fileLoader,
                    options: {
                        name: isProd
                            ?   '[folder]/[name][contenthash].[ext]'
                            :   '[folder]/[name].[ext]',
                        outputPath: 'assets'
                    }
                }
            }
        }
    }
    for (const regexpPart in defaults) {
        defaults[regexpPart].ruleOptions = { include, exclude }
    }


    return defaults
}
export {}