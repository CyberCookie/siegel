const { join } = require('path')

const { PATHS, LOC_NAMES } = require('../../constants')
const {
    loadersKeyMap, webpackModulesRegExp,

    DEPENDENCIES: {
        plugins: { miniCssExtract },
        loaders: {
            esbuild, cssLoader, sassLoader, styleLoader, sassResourcesLoader,
            postCssLoader, postCssAutoprefix, postCssSVG2Font
        }
    }
} = require('../constants')


module.exports = (CONFIG, RUN_PARAMS) => {
    const {
        target,
        input: { sassResources, include, exclude }
    } = CONFIG.build
    const { isProd, isServer } = RUN_PARAMS

    const isDev = !isProd


    const defaults: any = {
        [ webpackModulesRegExp.scripts ]: {
            loadersOrder: [ loadersKeyMap.esbuild ],
            loaders: {
                [ loadersKeyMap.esbuild ]: {
                    loader: esbuild,
                    options: {
                        target,
                        loader: 'tsx'
                    }
                }
            }
        },

        [ webpackModulesRegExp.styles ]: {
            loadersOrder: [ loadersKeyMap.cssFinal, loadersKeyMap.cssLoader, loadersKeyMap.postCssLoader, loadersKeyMap.sassLoader, loadersKeyMap.sassResources ],
            loaders: {
                [ loadersKeyMap.cssFinal ]: isProd || !isServer
                    ?   miniCssExtract.loader
                    :   styleLoader,

                [ loadersKeyMap.cssLoader ]: {
                    loader: cssLoader,
                    options: {
                        sourceMap: isDev,
                        // url: url => !url.endsWith('.svg'),
                        importLoaders: 2,
                        modules: {
                            localIdentName: isProd
                                ?   '[hash:base64:4]'
                                :   '[local]--[hash:base64:4]'
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
            },

            ...( PATHS.root != PATHS.cwd ? {
                ruleOptions: {
                    include: [ join(PATHS.root, LOC_NAMES.CLIENT_CORE_OUTPUT_DIR_NAME) ]
                }
            } : {})
        },

        [ webpackModulesRegExp.files ]: {
            ruleOptions: {
                type: 'asset/resource'
            }
        }
    }

    for (const regexpPart in defaults) {
        defaults[regexpPart].ruleOptions ||= {}
        const { ruleOptions } = defaults[regexpPart]
        const { include: _include, exclude: _exclude } = ruleOptions

        ruleOptions.include = _include && include
            ?   _include.concat(include)
            :   _include || include,

        ruleOptions.exclude = _exclude && exclude
            ?   _exclude.concat(exclude)
            :   _exclude || exclude
    }


    return defaults
}
export {}