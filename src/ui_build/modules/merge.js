module.exports = (defaultModules, userModules = {}) => {
    const result = {
        rules: []
    }


    function addRule(regExpPart, loaders, loaderOrder, ruleOptions = {}, defaultLoaders) {
        const use = []

        const order = loaderOrder || Object.keys(loaders)
        order.forEach(loaderKey => {
            const loaderParams = loaders
                ?   loaders[loaderKey]
                :   defaultLoaders[loaderKey]

            if (loaderParams !== false) {

                let loaderToPush;
                if (typeof loaderParams == 'string') {
                    loaderToPush = loaderParams
                } else {
                    const { enabled = true, options, loader, additionalLoaderOptions = {} } = loaderParams; 
                    enabled && (loaderToPush = {
                        loader,
                        options: typeof options == 'function' && defaultLoaders
                            ?   options(defaultLoaders[loaderKey].options)
                            :   options,
                        ...additionalLoaderOptions
                    })
                }
    
                use.push(loaderToPush)
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
            const { ruleOptions = {}, enabled = true, loaders, loaderOrder } = moduleConfig;
            enabled && addRule(regExpPart, loaders, loaderOrder, ruleOptions)
        }
    }


    for (const regExpPart in defaultModules) {
        if (regExpPart in userModules) {

            const userModule = userModules[regExpPart]
            if (userModule) {

                const { ruleOptions, enabled = true, loaders, loaderOrder } = userModule;
                if (enabled) {
                    const {
                        ruleOptions: defaultRuleOptions = {},
                        loaders: defaultLoaders,
                        loaderOrder: defaultLoaderOrder
                    } = defaultModules[regExpPart]

                    
                    const finalRuleOptions = typeof ruleOptions == 'function'
                        ?   ruleOptions(defaultRuleOptions)
                        :   Object.assign({}, defaultRuleOptions, ruleOptions)
                    
                    const finalLoadersOrder = typeof loaderOrder == 'function'
                        ?   loaderOrder(defaultLoaderOrder)
                        :   loaderOrder;
                    
                    
                    addRule(regExpPart, loaders, finalLoadersOrder, finalRuleOptions, defaultLoaders)
                }
            }
        } else addWithoutMerge(defaultModules, regExpPart)
    }


    for (const regExpPart in userModules) {
        defaultModules[regExpPart] || addWithoutMerge(userModules, regExpPart)
    }


    return result
}