function mergeLoaders(userLoader, defaultLoader) {
    if (!userLoader) return defaultLoader
    if (typeof userLoader == 'string' || !defaultLoader) return userLoader

    const {
        enabled: deafultEnabled = true,
        options: defaultOptions,
        loader: _defaultLoader,
        additionalLoaderOptions: deafultAdditionalLoaderOptions = {}
    } = defaultLoader

    const {
        enabled = deafultEnabled,
        options = defaultOptions,
        loader = _defaultLoader,
        additionalLoaderOptions = deafultAdditionalLoaderOptions
    } = userLoader


    if (enabled) {
        return {
            loader,
            options: typeof options == 'function' && defaultOptions && typeof defaultOptions != 'function'
                ?   options(defaultOptions)
                :   options,
            ...additionalLoaderOptions
        }
    }
}


module.exports = (defaultModules, userModules = {}) => {
    const rules = []


    function addRule(ruleParams) {
        const {
            regExpPart, loadersOrder, ruleOptions,
            loaders = {},
            defaultLoaders = {}
        } = ruleParams

        const use = []
        loadersOrder.forEach(loaderKey => {
            const userLoader = loaders[loaderKey]
            if (userLoader !== false) {
                const mergedLoaders = mergeLoaders(userLoader, defaultLoaders[loaderKey])
                mergedLoaders && use.push(mergedLoaders)
            }
        })


        rules.push({
            test: new RegExp(`\\.${regExpPart}$`),
            use,
            ...ruleOptions
        })
    }

    function addWithoutMerge(modules, regExpPart) {
        const { ruleOptions, enabled = true, loaders, loadersOrder } = modules[regExpPart]
        enabled && addRule({
            regExpPart, loaders, loadersOrder, ruleOptions
        })
    }


    for (const regExpPart in defaultModules) {
        const userModule = userModules[regExpPart]
        if (userModule) {

            if (userModule.enabled != false) {
                const { ruleOptions, loaders, loadersOrder, rewriteRegExp } = userModule
                const {
                    ruleOptions: defaultRuleOptions = {},
                    loaders: defaultLoaders,
                    loadersOrder: defaultLoadersOrder
                } = defaultModules[regExpPart]


                addRule({
                    loaders, defaultLoaders,
                    regExpPart: rewriteRegExp || regExpPart,

                    loadersOrder: loadersOrder
                        ?   typeof loadersOrder == 'function'
                            ?   loadersOrder(defaultLoadersOrder)
                            :   loadersOrder
                        :   defaultLoadersOrder,

                    ruleOptions: typeof ruleOptions == 'function'
                        ?   ruleOptions(defaultRuleOptions)
                        :   Object.assign({}, defaultRuleOptions, ruleOptions)
                })
            }
        } else addWithoutMerge(defaultModules, regExpPart)
    }


    for (const regExpPart in userModules) {
        defaultModules[regExpPart] || addWithoutMerge(userModules, regExpPart)
    }


    return rules
}
export {}