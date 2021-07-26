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
    const result = {
        rules: []
    }


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


        result.rules.push({
            test: new RegExp(`\\.${regExpPart}$`),
            use,
            ...ruleOptions
        })
    }

    function addWithoutMerge(modules, regExpPart) {
        const moduleConfig = modules[regExpPart]
        if (moduleConfig) {
            const { ruleOptions, enabled = true, loaders, loadersOrder } = moduleConfig
            enabled && addRule({
                regExpPart, loaders, loadersOrder, ruleOptions
            })
        }
    }


    for (const regExpPart in defaultModules) {
        if (userModules[regExpPart]) {

            const userModule = userModules[regExpPart]
            if (userModule) {

                const { ruleOptions, enabled = true, loaders, loadersOrder, rewriteRegExp } = userModule
                if (enabled) {
                    const {
                        ruleOptions: defaultRuleOptions = {},
                        loaders: defaultLoaders,
                        loadersOrder: defaultLoadersOrder
                    } = defaultModules[regExpPart]


                    const finalRuleOptions = typeof ruleOptions == 'function'
                        ?   ruleOptions(defaultRuleOptions)
                        :   Object.assign({}, defaultRuleOptions, ruleOptions)

                    const finalLoadersOrder = loadersOrder
                        ?   typeof loadersOrder == 'function'
                            ?   loadersOrder(defaultLoadersOrder)
                            :   loadersOrder
                        :   defaultLoadersOrder


                    addRule({
                        loaders, defaultLoaders,
                        regExpPart: rewriteRegExp,
                        loadersOrder: finalLoadersOrder,
                        ruleOptions: finalRuleOptions
                    })
                }
            }
        } else addWithoutMerge(defaultModules, regExpPart)
    }


    for (const regExpPart in userModules) {
        defaultModules[regExpPart] || addWithoutMerge(userModules, regExpPart)
    }


    return result
}
export {}