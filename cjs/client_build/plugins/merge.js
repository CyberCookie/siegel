const mergeOptions = (defaultOptions, userOptions, rewrite) => (typeof userOptions == 'function'
    ? userOptions(defaultOptions)
    : !rewrite && typeof defaultOptions == 'object'
        ? Array.isArray(defaultOptions)
            ? defaultOptions.concat(userOptions)
            : Object.assign({}, defaultOptions, userOptions)
        : userOptions);
module.exports = (defaultPlugins, userPlugins = {}) => {
    const result = [];
    function addWithoutMerge(pluginConfig) {
        const { instances, enabled = true, plugin, options } = pluginConfig;
        if (instances) {
            for (const instanceKey in instances) {
                const { enabled, options } = instances[instanceKey];
                enabled && result.push(new plugin(options));
            }
        }
        else if (enabled) {
            result.push(new plugin(options));
        }
    }
    for (const pluginKey in defaultPlugins) {
        const pluginConfig = defaultPlugins[pluginKey];
        const { plugin, options, instances } = pluginConfig;
        if (userPlugins[pluginKey]) {
            const { rewrite, plugin: userPlugin = plugin, options: userOptions, instances: userInstances } = userPlugins[pluginKey];
            if (userInstances) {
                for (const userPluginInstanceKey in userInstances) {
                    const userInstance = userInstances[userPluginInstanceKey];
                    if (userInstance) {
                        const { rewrite, options: userInstanceOptions } = userInstance;
                        let finalPluginInstanceOptions = userInstanceOptions;
                        const defaultInstance = instances[userPluginInstanceKey];
                        if (defaultInstance) {
                            finalPluginInstanceOptions = mergeOptions(defaultInstance.options, userInstanceOptions, rewrite);
                        }
                        result.push(new userPlugin(finalPluginInstanceOptions));
                    }
                }
            }
            else {
                const finalPluginOptions = mergeOptions(options, userOptions, rewrite);
                result.push(new userPlugin(finalPluginOptions));
            }
        }
        else if (userPlugins[pluginKey] !== false) {
            addWithoutMerge(pluginConfig);
        }
    }
    for (const userPluginKey in userPlugins) {
        defaultPlugins[userPluginKey] || addWithoutMerge(userPlugins[userPluginKey]);
    }
    return result;
};
