import { PATHS } from '../../constants.js'
import { loadersKeyMap, webpackModulesRegExp, DEPENDENCIES } from '../constants.js'

import type { ConfigFinal, RunParamsFinal } from '../../types'
import type { DefaultModules, DefaultsWithRuleOptions } from './types'


const {
    plugins: { miniCssExtract },
    loaders: {
        esbuild, cssLoader, sassLoader, styleLoader, sassResourcesLoader,
        postCssLoader, postCssAutoprefix, postCssSVG2Font
    }
} = DEPENDENCIES


function getDefaultModulesConfig(CONFIG: ConfigFinal, RUN_PARAMS: RunParamsFinal) {
    const {
        output: { target },
        input: { sassResources, include, exclude }
    } = CONFIG.build
    const { isProd, isServer, _isSelfDevelopment } = RUN_PARAMS

    const isDev = !isProd


    const defaults: DefaultModules = {
        [ webpackModulesRegExp.scripts ]: {
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

        [ webpackModulesRegExp.styles ]: {
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
                                postCssSVG2Font({ isWoff2: isProd })
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

        [ webpackModulesRegExp.files ]: {
            ruleOptions: {
                type: 'asset/resource'
            }
        }
    }

    for (const regexpPart in defaults) {
        (defaults[regexpPart as keyof DefaultModules] as DefaultsWithRuleOptions).ruleOptions ||= {}

        const { ruleOptions } = defaults[regexpPart as keyof DefaultModules] as DefaultsWithRuleOptions
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


export default getDefaultModulesConfig