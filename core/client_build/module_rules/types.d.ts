import type { RuleSetRule, RuleSetUseItem, ModuleOptions } from 'webpack'
import type { Plugin as PostCssPlugin } from 'postcss'
import type { ConfigFinal } from '../../types'



type WebpackModuleRulesRegExp = typeof import('../constants').webpackModuleRulesRegExp

type AnyDefaultLoader = Exclude<Loader, boolean | string>


type DefaultsWithRuleOptions = {
    ruleOptions: {
        include?: string[]
        exclude?: string[]
    }
}

type AddRuleFn = (
    rules: RuleSetRule[],
    ruleParams: {
        regExpString: string
        ruleOptions: RuleOptions
        loadersOrder: LoadersOrder
        loaders?: Loaders
        defaultLoaders?: Loaders
    }
) => void

type MergeLoadersFn = (
    userLoader: Exclude<Loader, false>,
    defaultLoader: AnyDefaultLoader | undefined
) => RuleSetUseItem | undefined



type WebpackLoaderObj = Exclude<NonNullable<RuleSetUseItem>, string | AnyFunc>
type WebpackLoaderObjOptions = WebpackLoaderObj['options']


type RuleOptions = Omit<RuleSetRule, 'test' | 'use'>
type RuleOptionsFn = (options: RuleOptions) => RuleOptions



type LoadersOrder = string[]

type LoadersOrderFn<
    _DefaultModule extends UserRule | null = null,
    _DefaultModuleLoaders = NonNullable<_DefaultModule>['loaders'],
    _DefaultModuleLoadersOrder = NonNullable<_DefaultModule>['loadersOrder']
> = (
    order: _DefaultModule extends null
        ?   LoadersOrder
        :   _DefaultModuleLoaders extends Obj
            ?   _DefaultModuleLoadersOrder
            :   LoadersOrder
) => LoadersOrder


type LoaderOptionsFn<
    _DefaultLoader extends Loader | null = null,
    _DefaultLoaderOptions = Exclude<_DefaultLoader, null | boolean | string>['options']
> = (
    defaultOptions: _DefaultLoader extends null
        ?   WebpackLoaderObjOptions
        :   _DefaultLoaderOptions extends Obj
            ?   _DefaultLoaderOptions
            :   WebpackLoaderObjOptions
) => WebpackLoaderObjOptions

type LoaderObj<_DefaultLoader extends Loader | null = null> = {
    enabled?: boolean
    options?: WebpackLoaderObjOptions | LoaderOptionsFn<_DefaultLoader> //TODO typing: loader options
} & Exclude<WebpackLoaderObj, 'options'>

type Loader<
    _DefaultLoader extends Loader | null = null
> = string | boolean | LoaderObj<_DefaultLoader>

type Loaders<
    _DefaultRule extends UserRule | null = null,
    _DefaultRuleLoaders = Exclude<_DefaultRule, null>['loaders']
> = (
    _DefaultRule extends null
        ?   object
        :   { [ K in keyof _DefaultRuleLoaders]?: Loader<NonNullable<_DefaultRuleLoaders[K]>> }
) & Obj<Loader>



type UserRule<_DefaultRule extends UserRule | null = null> = {
    enabled?: boolean
    rewriteRegExp?: string
    loaders?:  Loaders<_DefaultRule>
    loadersOrder?: LoadersOrder | LoadersOrderFn<_DefaultRule>
    ruleOptions?: RuleOptions | RuleOptionsFn
}


type UserRulesData = {
    order?: string[] | ((defaultOrder: DefaultRulesKeys[]) => string[])

    rules?: {
        [key in WebpackModuleRulesRegExp['worker']]?: UserRule<DefaultRules[WebpackModuleRulesRegExp['worker']]>
    } & {
        [key in WebpackModuleRulesRegExp['scripts']]?: UserRule<DefaultRules[WebpackModuleRulesRegExp['scripts']]>
    } & {
        [key in WebpackModuleRulesRegExp['styles']]?: UserRule<DefaultRules[WebpackModuleRulesRegExp['styles']]>
    } & {
        [key in WebpackModuleRulesRegExp['files']]?: UserRule
    } & Obj<UserRule<any>>

    moduleOptions?: Omit<ModuleOptions, 'rules'>
}


type DefaultRules = DefaultRulesData['rules']
type DefaultRulesKeys = keyof DefaultRules

type DefaultRulesData = {
    order: DefaultRulesKeys[]

    rules: {
        [key in WebpackModuleRulesRegExp['worker']]: {
            loadersOrder: (keyof DefaultRules[WebpackModuleRulesRegExp['worker']]['loaders'])[]
            loaders: {
                workers: {
                    loader: string
                    ident: string
                }
            }
            ruleOptions: {
                include: string[]
            }
        }
    } & {
        [key in WebpackModuleRulesRegExp['scripts']]: {
            loadersOrder: (keyof DefaultRules[WebpackModuleRulesRegExp['scripts']]['loaders'])[]
            loaders: {
                esbuildLoader: {
                    loader: string
                    ident: string
                    options: {
                        target: ConfigFinal['build']['output']['target']
                        loader: string
                    }
                }
            }
        }
    } & {
        [key in WebpackModuleRulesRegExp['styles']]: {
            loadersOrder: (keyof DefaultRules[WebpackModuleRulesRegExp['styles']]['loaders'])[]
            loaders: {
                cssFinal: {
                    loader: string
                    ident: string
                }

                cssLoader: {
                    loader: string
                    ident: string
                    options: {
                        sourceMap: boolean
                        importLoaders: number
                        modules: {
                            exportLocalsConvention: string
                            namedExport: boolean
                            localIdentName: string
                        }
                    }
                }

                postCssLoader: {
                    loader: string
                    ident: string
                    options: {
                        sourceMap: boolean
                        postcssOptions: {
                            plugins: PostCssPlugin[]
                        }
                    }
                }

                sassLoader: {
                    loader: string
                    ident: string
                    options: {
                        sourceMap: boolean
                    }
                }

                sassResources?: {
                    loader: string
                    ident: string
                    options: {
                        resources: string
                    }
                }
            }
            ruleOptions?: {
                include: string[]
            }
        }
    } & {
        [key in WebpackModuleRulesRegExp['files']]: {
            ruleOptions: {
                type: string
            }
        }
    }
}


export type {
    DefaultRulesData, DefaultRulesKeys,
    UserRulesData, UserRule,
    DefaultsWithRuleOptions, RuleOptions, AddRuleFn,
    MergeLoadersFn, LoadersOrder, Loader, LoaderObj, LoaderOptionsFn, AnyDefaultLoader
}