import { PATHS, IS_SELF_DEVELOPMENT } from '../../constants.js'
import { loadersKeyMap, webpackModuleRulesRegExp, DEPENDENCIES } from '../constants.js'

import type { ConfigObject } from '../../types'
import type { DefaultRulesData, DefaultsWithRuleOptions } from './types'


const {
    plugins: { miniCssExtract },
    loaders: {
        swcLoader, cssLoader, sassLoader, styleLoader, sassResourcesLoader, workerLoader,
        postCssLoader, postCssAutoprefix, postCssSVG2Font
    }
} = DEPENDENCIES


function getDefaultModulesConfig(config: ConfigObject) {
    const { build, runMode } = config
    const { isProd, isServer } = runMode!
    const { input, output } = build!

    const sourceMap = !isProd


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
                include: [ PATHS.CLIENT_CORE_OUTPUT ]
            }
        },

        [ webpackModuleRulesRegExp.scripts ]: {
            loadersOrder: [ loadersKeyMap.swcLoader ],
            loaders: {
                [ loadersKeyMap.swcLoader ]: {
                    ident: loadersKeyMap.swcLoader,
                    loader: swcLoader,
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript',
                                jsx: true
                            },
                            target: output!.target!
                        }
                    }
                }
            }
        },

        [ webpackModuleRulesRegExp.styles ]: {
            loadersOrder: [
                loadersKeyMap.cssFinal,
                loadersKeyMap.cssLoader,
                loadersKeyMap.postCssLoader,
                loadersKeyMap.sassLoader,
                ...( input!.sassResources ? [ loadersKeyMap.sassResources ] : [])
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
                        sourceMap,
                        // url: url => !url.endsWith('.svg'),
                        importLoaders: 2,
                        modules: {
                            exportLocalsConvention: 'as-is',
                            namedExport: false,
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
                        sourceMap,
                        postcssOptions: {
                            plugins: [
                                postCssAutoprefix({ overrideBrowserslist: 'last 1 version' }),

                                ...( input!.iconsRoot ? [
                                    postCssSVG2Font({
                                        isWoff2: isProd,
                                        iconsRoot: input!.iconsRoot
                                    })
                                ] : [])
                            ]
                        }
                    }
                },

                [ loadersKeyMap.sassLoader ]: {
                    loader: sassLoader,
                    ident: loadersKeyMap.sassLoader,
                    options: { sourceMap }
                },

                ...( input!.sassResources ? {
                    [ loadersKeyMap.sassResources ]: {
                        loader: sassResourcesLoader,
                        ident: loadersKeyMap.sassResources,
                        options: {
                            resources: input!.sassResources
                        }
                    }
                } : {})
            },

            ...( IS_SELF_DEVELOPMENT
                ?   {}
                :   {
                        ruleOptions: {
                            include: [ PATHS.CLIENT_CORE_OUTPUT ]
                        }
                    })
        },

        [ webpackModuleRulesRegExp.files ]: {
            ruleOptions: {
                type: 'asset/resource'
            }
        }
    }

    Object.values(defaultRules)
        .forEach(defaultRule => {

            (defaultRule as DefaultsWithRuleOptions).ruleOptions ||= {}
            const { ruleOptions } = defaultRule as DefaultsWithRuleOptions

            const {
                include: _include,
                exclude: _exclude
            } = ruleOptions

            ruleOptions.include = _include && input!.include
                ?   _include.concat(input!.include)
                :   _include || input!.include,

            ruleOptions.exclude = _exclude && input!.exclude
                ?   _exclude.concat(input!.exclude)
                :   _exclude || input!.exclude
            })


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