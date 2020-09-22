const { dirname, join, isAbsolute } = require('path')
const existsSync                    = require('fs').existsSync;

const CONSTANTS                     = require('./constants')


function mergeConfigWithDefaults(CONFIG, DEFAULT_CONFIG) {
    for (const key in DEFAULT_CONFIG) {
        const defaultValue = DEFAULT_CONFIG[key]
        const configValue = CONFIG[key]

        if (configValue === undefined) {
            CONFIG[key] = defaultValue
        } else if (Array.isArray(configValue) && Array.isArray(defaultValue)) {
            CONFIG[key] = Array.from(new Set( defaultValue.concat(configValue) ))
        } else if (configValue.constructor.name == 'Object' && defaultValue.constructor.name == 'Object') {
            mergeConfigWithDefaults(CONFIG[key], defaultValue)
        }
    }
}



//TODO:
module.exports = (CONFIG = {}, RUN_PARAMS = {}) => {
    if (RUN_PARAMS) mergeConfigWithDefaults(RUN_PARAMS, CONSTANTS.DEFAULT_RUN_PARAMS)
    else RUN_PARAMS = CONSTANTS.DEFAULT_RUN_PARAMS;

    RUN_PARAMS.isDevServer = !RUN_PARAMS.isProd && RUN_PARAMS.isServer



    let stringConfig;
    if (typeof CONFIG == 'string') {
        stringConfig = CONFIG;
        CONFIG = {}
    }
    
    mergeConfigWithDefaults(CONFIG, CONSTANTS.DEFAULT_CONFIG)

    if (RUN_PARAMS.isBuild) {
        const { input } = CONFIG.build;
        

        if (stringConfig) {
            input.js = isAbsolute(stringConfig)
                ?   stringConfig
                :   join(dirname(process.argv[1]), stringConfig)
        }
        if (!existsSync(input.js)) {
            throw `build.input.js ->> [${input.js}] file doesn't exists.`
        }
        

        input.include.push( dirname(input.js) )
    }


    return { CONFIG, RUN_PARAMS }
}