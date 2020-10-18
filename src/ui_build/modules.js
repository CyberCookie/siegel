// const cssSVG         = require('iconfont-webpack-plugin')
const miniCssExtract    = require('mini-css-extract-plugin')

const { loadersKeyMap, webpackModulesRegExp } = require('./constants')


const resolve = require.resolve;


function mergeModules(defaultModules, userModules = {}) {
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

function getModules(CONFIG, RUN_PARAMS) {
    const { input, modules: userModules } = CONFIG.build;
    const { sassResources, include, exclude } = input;
    const { isProd, isServer } = RUN_PARAMS;


    const defaults = {
        [webpackModulesRegExp.scripts]: {
            loaderOrder: [loadersKeyMap.babel, loadersKeyMap.eslint],
            loaders: {
                [loadersKeyMap.babel]: {
                    loader: resolve('babel-loader'),
                    options: {
                        cacheDirectory: true,
                        presets: [
                            resolve('@babel/preset-react'),
                            resolve('@babel/preset-typescript')
                        ],
                        plugins: [
                            resolve('@babel/plugin-proposal-export-default-from'),
                            resolve('@babel/plugin-proposal-export-namespace-from'),
                            resolve('@babel/plugin-syntax-dynamic-import'),
                            ...( isProd ? [] : [ resolve('react-refresh/babel') ])
                        ]
                    }
                },

                [loadersKeyMap.eslint]: {
                    loader: resolve('eslint-loader'),
                    options: {
                        emitWarning: true
                    }
                }
            }
        },

        [webpackModulesRegExp.styles]: {
            loaderOrder: [loadersKeyMap.cssFinal, loadersKeyMap.cssLoader, loadersKeyMap.postCssLoader, loadersKeyMap.sassLoader, loadersKeyMap.sassResources],
            loaders: {
                [loadersKeyMap.cssFinal]: isProd || !isServer ? miniCssExtract.loader : resolve('style-loader'),

                [loadersKeyMap.cssLoader]: {
                    loader: resolve('css-loader'),
                    options: {
                        sourceMap: !isProd,
                        importLoaders: 3,
                        url: url => url.endsWith('.svg'),
                        modules: {
                            localIdentName: isProd ? '[hash:base64:4]' : '[local]--[hash:base64:4]'
                        }
                    }
                },

                [loadersKeyMap.postCssLoader]: {
                    loader: resolve('postcss-loader'),
                    options: {
                        sourceMap: !isProd,
                        postcssOptions: {
                            plugins: [
                                [ resolve('autoprefixer'), { overrideBrowserList: 'last 1 version' } ],
                            ]
                        }
                    }
                },

                [loadersKeyMap.sassLoader]: {
                    loader: resolve('sass-loader'),
                    options: {
                        sourceMap: !isProd
                    }
                },

                [loadersKeyMap.sassResources]: {
                    loader: resolve('sass-resources-loader'),
                    options: {
                        resources: sassResources
                    }
                }
            }
        }
    }
    for (let regexpPart in defaults) {
        defaults[regexpPart].ruleOptions = { include, exclude }
    }


    return mergeModules(defaults, userModules)
}


module.exports = getModules