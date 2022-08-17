import type { RuleSetRule, RuleSetUseItem } from 'webpack'
import type { Plugin as PostCssPlugin } from 'postcss'
import type { ConfigFinal } from '../../types'


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



type WebpackLoaderObj = Exclude<NonNullable<RuleSetUseItem>, string | Function>
type WebpackLoaderObjOptions = WebpackLoaderObj['options']


type RuleOptions = Omit<RuleSetRule, 'test' | 'use'>
type RuleOptionsFn = (options: RuleOptions) => RuleOptions



type LoadersOrder = string[]
type LoadersOrderFn<_DefaultModule = null> = (
    order: _DefaultModule extends null
        ?   LoadersOrder
        :   _DefaultModule['loaders'] extends Indexable
            ?   _DefaultModule['loadersOrder']
            :   LoadersOrder
) => LoadersOrder

type LoaderOptionsFn<_DefaultLoader = null> = (
    defaultOptions: _DefaultLoader extends null
        ?   WebpackLoaderObjOptions
        :   _DefaultLoader['options'] extends Indexable
            ?   _DefaultLoader['options']
            :   WebpackLoaderObjOptions
) => WebpackLoaderObjOptions

type LoaderObj<_DefaultLoader = null> = {
    enabled?: boolean
    options?: WebpackLoaderObjOptions | LoaderOptionsFn<_DefaultLoader>
} & Exclude<WebpackLoaderObj, 'options'>

type Loader<_DefaultLoader = null> = string | boolean | LoaderObj<_DefaultLoader>
type AnyDefaultLoader = Exclude<Loader, boolean | string>

type Loaders<_DefaultModule = null> = (
    _DefaultModule extends null
        ?   {}
        :   { [ K in keyof _DefaultModule['loaders']]?: Loader<_DefaultModule['loaders'][K]> }
) & Indexable<Loader>


type UserModule<_DefaultModule = null> = {
    enabled?: boolean
    rewriteRegExp?: string
    loaders?:  Loaders<_DefaultModule>
    loadersOrder?: LoadersOrder | LoadersOrderFn<_DefaultModule>
    ruleOptions?: RuleOptions | RuleOptionsFn
}



type Modules = {
    '\\.[tj]sx?$'?: UserModule<DefaultModules['\\.[tj]sx?$']>
    '\\.(c|sc|sa)ss$'?: UserModule<DefaultModules['\\.(c|sc|sa)ss$']>
    '\\.(avif|webp|jpg|png|svg|woff2?)$'?: UserModule

    [key: string]: UserModule<any>
}



type DefaultModules = {
    '\\.[tj]sx?$': {
        loadersOrder: (keyof DefaultModules['\\.[tj]sx?$']['loaders'])[]
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

    '\\.(c|sc|sa)ss$': {
        loadersOrder: (keyof DefaultModules['\\.(c|sc|sa)ss$']['loaders'])[]
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

    '\\.(avif|webp|jpg|png|svg|woff2?)$': {
        ruleOptions: {
            type: string
        }
    }
}


export type {
    DefaultModules, Modules, UserModule,
    DefaultsWithRuleOptions, AddRuleFn, MergeLoadersFn,
    LoadersOrder, RuleOptions, Loader, LoaderObj, LoaderOptionsFn, AnyDefaultLoader
}