import { PATHS } from '../../constants.js'
import { loadersKeyMap, webpackModuleRulesRegExp, DEPENDENCIES } from '../constants.js'

import type { ConfigFinal, RunParamsFinal } from '../../types'
import type { DefaultRulesData, DefaultRulesKeys, DefaultsWithRuleOptions } from './types'


const {
    plugins: { miniCssExtract },
    loaders: {
        esbuild, cssLoader, sassLoader, styleLoader, sassResourcesLoader, workerLoader,
        postCssLoader, postCssAutoprefix, postCssSVG2Font
    }
} = DEPENDENCIES


function getDefaultModulesConfig(CONFIG: ConfigFinal, RUN_PARAMS: RunParamsFinal) {
    const {
        output: { target },
        input: { sassResources, iconsRoot, include, exclude }
    } = CONFIG.build
    const { isProd, isServer, _isSelfDevelopment } = RUN_PARAMS

    const isDev = !isProd


    const defaultRules: DefaultRulesData['rules'] = {
        [ webpackModuleRulesRegExp.worker ]: {
            loadersOrder: [ loadersKeyMap.workers ],
            loaders: {
                [ loadersKeyMap.workers ]: {
                    ident: loadersKeyMap.workers,
                    loader: workerLoader
                }
            },
            ruleOptions: {
                include: [ PATHS.clientCoreOutput ]
            }
        },

        [ webpackModuleRulesRegExp.scripts ]: {
            loadersOrder: [ loadersKeyMap.esbuild ],
            loaders: {
                [ loadersKeyMap.esbuild ]: {
                    ident: loadersKeyMap.esbuild,
                    loader: esbuild,
                    options: {
                        target,
                        loader: 'tsx'
                    }
                }
            }
        },

        [ webpackModuleRulesRegExp.styles ]: {
            loadersOrder: [
                loadersKeyMap.cssFinal, loadersKeyMap.cssLoader, loadersKeyMap.postCssLoader,
                loadersKeyMap.sassLoader, loadersKeyMap.sassResources
            ],
            loaders: {
                [ loadersKeyMap.cssFinal ]: {
                    ident: loadersKeyMap.cssFinal,
                    loader: isProd || !isServer
                        ?   miniCssExtract.loader
                        :   styleLoader
                },

                [ loadersKeyMap.cssLoader ]: {
                    loader: cssLoader,
                    ident: loadersKeyMap.cssLoader,
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
                    ident: loadersKeyMap.postCssLoader,
                    options: {
                        sourceMap: isDev,
                        postcssOptions: {
                            plugins: [
                                postCssAutoprefix({ overrideBrowserslist: 'last 1 version' }),

                                ...( iconsRoot ? [
                                    postCssSVG2Font({
                                        isWoff2: isProd,
                                        iconsRoot
                                    })
                                ] : [])
                            ]
                        }
                    }
                },

                [ loadersKeyMap.sassLoader ]: {
                    loader: sassLoader,
                    ident: loadersKeyMap.sassLoader,
                    options: {
                        sourceMap: isDev
                    }
                },

                ...( sassResourcesLoader ? {
                    [ loadersKeyMap.sassResources ]: {
                        loader: sassResourcesLoader,
                        ident: loadersKeyMap.sassResources,
                        options: {
                            resources: sassResources!
                        }
                    }
                } : {})
            },

            ...( !_isSelfDevelopment ? {
                ruleOptions: {
                    include: [ PATHS.clientCoreOutput ]
                }
            }: {})
        },

        [ webpackModuleRulesRegExp.files ]: {
            ruleOptions: {
                type: 'asset/resource'
            }
        }
    }

    for (const ruleRegExp in defaultRules) {
        (defaultRules[ruleRegExp as DefaultRulesKeys] as DefaultsWithRuleOptions).ruleOptions ||= {}

        const { ruleOptions } = defaultRules[ruleRegExp as DefaultRulesKeys] as DefaultsWithRuleOptions
        const { include: _include, exclude: _exclude } = ruleOptions

        ruleOptions.include = _include && include
            ?   _include.concat(include)
            :   _include || include,

        ruleOptions.exclude = _exclude && exclude
            ?   _exclude.concat(exclude)
            :   _exclude || exclude
    }


    const defaultRulesData: DefaultRulesData = {
        order: [
            webpackModuleRulesRegExp.worker,
            webpackModuleRulesRegExp.scripts,
            webpackModuleRulesRegExp.styles,
            webpackModuleRulesRegExp.files
        ],
        rules: defaultRules
    }


    return defaultRulesData
}


export default getDefaultModulesConfig