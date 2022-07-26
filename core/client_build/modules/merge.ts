import isExists from '../../../common/is/exists/index.js'

import type { RuleSetRule } from 'webpack'
import type {
    DefaultModules, Modules, UserModule, AddRuleFn, MergeLoadersFn,
    LoadersOrder, RuleOptions, AnyDefaultLoader, LoaderObj, LoaderOptionsFn
} from './types'


const mergeLoaders: MergeLoadersFn = (userLoader, defaultLoader) => {
    const result = typeof userLoader == 'string'
        ?   userLoader

        :   isExists(defaultLoader) && userLoader === true

            ?   defaultLoader

            :   (userLoader as LoaderObj).enabled !== false

                ?   Object.assign({}, defaultLoader, userLoader as LoaderObj, {
                        options: typeof (userLoader as LoaderObj).options == 'function'
                            ?   ((userLoader as LoaderObj).options as LoaderOptionsFn)(defaultLoader!.options)
                            :   (userLoader as LoaderObj).options
                    })

                :   undefined


    if (isExists(result) && typeof result != 'string') delete result['enabled']


    return result
}


const addRule: AddRuleFn = (rules, ruleParams) => {
    const {
        regExpString, ruleOptions, loadersOrder,
        loaders = {},
        defaultLoaders = {}
    } = ruleParams


    const use: NonNullable<RuleSetRule['use']> = []
    loadersOrder.forEach(loaderKey => {
        const userLoader = loaders[loaderKey]
        if (userLoader !== false) {

            const mergedLoaders = mergeLoaders(
                userLoader,
                defaultLoaders[loaderKey] as AnyDefaultLoader | undefined
            )
            mergedLoaders && use.push(mergedLoaders)
        }
    })


    rules.push({
        test: new RegExp(regExpString),
        use,
        ...ruleOptions
    })
}

function addWithoutMerge(
    rules: RuleSetRule[],
    module: UserModule,
    regExpString: string
) {

    const { ruleOptions, enabled = true, loaders, loadersOrder } = module
    enabled && addRule(
        rules,
        {
            regExpString, loaders,

            loadersOrder: typeof loadersOrder == 'function'
                ?   loadersOrder([])
                :   loadersOrder || [],

            ruleOptions: typeof ruleOptions == 'function'
                ?   ruleOptions({})
                :   ruleOptions || {}
        }
    )
}


function merge(defaultModules: DefaultModules, userModules: Modules = {}) {
    const rules: RuleSetRule[] = []


    for (const regExpString in defaultModules) {
        const userModule = userModules[regExpString as keyof typeof userModules]
        if (userModule) {

            if (userModule.enabled != false) {
                const { ruleOptions, loaders, loadersOrder, rewriteRegExp } = userModule
                const {
                    ruleOptions: defaultRuleOptions = {},
                    loaders: defaultLoaders,
                    loadersOrder: defaultLoadersOrder
                } = defaultModules[regExpString as keyof DefaultModules] as UserModule


                addRule(
                    rules,
                    {
                        loaders, defaultLoaders,
                        regExpString: rewriteRegExp || regExpString,

                        loadersOrder: loadersOrder
                            ?   typeof loadersOrder == 'function'
                                ?   loadersOrder(defaultLoadersOrder as LoadersOrder)
                                :   loadersOrder
                            :   defaultLoadersOrder as LoadersOrder,

                        ruleOptions: ruleOptions
                            ?   typeof ruleOptions == 'function'
                                ?   ruleOptions(defaultRuleOptions as RuleOptions)
                                :   Object.assign({}, defaultRuleOptions, ruleOptions)
                            :   defaultRuleOptions as RuleOptions
                    }
                )
            }

        } else addWithoutMerge(rules, defaultModules[regExpString as keyof DefaultModules], regExpString)
    }


    for (const regExpString in userModules) {
        defaultModules[regExpString as keyof typeof defaultModules]
        ||  addWithoutMerge(rules, userModules[regExpString], regExpString)
    }


    return rules
}


export default merge