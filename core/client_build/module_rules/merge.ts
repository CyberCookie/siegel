import isExists from '../../../common/is/exists'

import type { RuleSetRule } from 'webpack'
import type {
    DefaultRulesData, UserRulesData, UserRule, AddRuleFn, MergeLoadersFn,
    LoadersOrder, RuleOptions, AnyDefaultLoader, LoaderObj, LoaderOptionsFn,
    DefaultRulesKeys
} from './types'


const mergeLoaders: MergeLoadersFn = (userLoader, defaultLoader) => {
    const result = typeof userLoader == 'string'
        ?   userLoader

        :   isExists(defaultLoader) && userLoader === true

            ?   defaultLoader

            :   (userLoader as LoaderObj).enabled !== false

                ?   {
                        ...defaultLoader,
                        ...userLoader as LoaderObj,
                        options: typeof (userLoader as LoaderObj).options == 'function'
                            ?   ((userLoader as LoaderObj).options as LoaderOptionsFn)(defaultLoader!.options)
                            :   (userLoader as LoaderObj).options
                    }

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
        if (userLoader) {
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
    module: UserRule,
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


function merge(defaultModules: DefaultRulesData, userModules: UserRulesData = { rules: {} }) {
    const rules: RuleSetRule[] = []

    const {
        order: userRulesOrder,
        rules: userRules = {}
    } = userModules

    const {
        order: defaultRulesOrder,
        rules: defaultRules
    } = defaultModules

    const rulesOrder = userRulesOrder
        ?   typeof userRulesOrder == 'function'
            ?   userRulesOrder(defaultRulesOrder)
            :   userRulesOrder
        :   defaultRulesOrder



    rulesOrder.forEach(regExpModuleKey => {
        const defaultRule = defaultRules[regExpModuleKey as DefaultRulesKeys]
        const userRule = userRules[regExpModuleKey]


        if (userRule && defaultRule) {
            if (userRule.enabled != false) {
                const { ruleOptions, loaders, loadersOrder, rewriteRegExp } = userRule
                const {
                    ruleOptions: defaultRuleOptions = {},
                    loaders: defaultLoaders,
                    loadersOrder: defaultLoadersOrder
                } = defaultRule as UserRule


                addRule(
                    rules,
                    {
                        loaders, defaultLoaders,
                        regExpString: rewriteRegExp || regExpModuleKey,

                        loadersOrder: loadersOrder
                            ?   typeof loadersOrder == 'function'
                                ?   loadersOrder(defaultLoadersOrder as LoadersOrder)
                                :   loadersOrder
                            :   defaultLoadersOrder as LoadersOrder,

                        ruleOptions: ruleOptions
                            ?   typeof ruleOptions == 'function'
                                ?   ruleOptions(defaultRuleOptions as RuleOptions)
                                :   { ...defaultRuleOptions, ...ruleOptions }
                            :   defaultRuleOptions as RuleOptions
                    }
                )
            }

        } else addWithoutMerge(rules, defaultRule || userRule, regExpModuleKey)
    })


    return rules
}


export default merge