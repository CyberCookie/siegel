const { dirname }       = require('path')
const { existsSync }    = require('fs')

const { DEFAULT_RUN_PARAMS, DEFAULT_CONFIG } = require('./constants')


function mergeConfigWithDefaults(CONFIG: any, DEFAULT_CONFIG: any) {
    for (const key in DEFAULT_CONFIG) {
        const defaultValue = DEFAULT_CONFIG[key]
        const configValue = CONFIG[key]

        if (configValue === undefined) {
            CONFIG[key] = defaultValue
        } else if (Array.isArray(configValue) && Array.isArray(defaultValue)) {
            CONFIG[key] = Array.from(new Set( defaultValue.concat(configValue) ))
        } else if (configValue.constructor == Object && defaultValue.constructor == Object) {
            mergeConfigWithDefaults(CONFIG[key], defaultValue)
        }
    }
}



module.exports = (CONFIG: any = {}, RUN_PARAMS: any = {}) => {
    if (RUN_PARAMS) mergeConfigWithDefaults(RUN_PARAMS, DEFAULT_RUN_PARAMS)
    else RUN_PARAMS = DEFAULT_RUN_PARAMS

    const { isProd, isServer, isBuild }= RUN_PARAMS
    RUN_PARAMS._isDevServer = !isProd && isServer



    let stringConfig
    if (typeof CONFIG == 'string') {
        stringConfig = CONFIG
        CONFIG = {}
    }

    mergeConfigWithDefaults(CONFIG, DEFAULT_CONFIG)
    if (isBuild) {
        const { input, output } = CONFIG.build


        output.filenames = output.filenames[ isProd ? 'PROD' : 'DEV' ]


        stringConfig && (input.js = stringConfig)

        if (existsSync(input.js)) {
            const userJSEntryDirName = dirname(input.js)
            input.include
                ?   input.include.push( userJSEntryDirName )
                :   (input.include = [ userJSEntryDirName ])
        } else throw `build.input.js ->> [${input.js}] file doesn't exists.`
    }


    return { CONFIG, RUN_PARAMS }
}
export {}