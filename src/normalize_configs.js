import path from 'path'
import fs from 'fs'

import { DEFAULT_RUN_PARAMS, DEFAULT_CONFIG } from './constants.js'


function mergeConfigWithDefaults(CONFIG, DEFAULT_CONFIG) {
    for (const key in DEFAULT_CONFIG) {
        const defaultValue = DEFAULT_CONFIG[key]
        const configValue = CONFIG[key]

        if (configValue === undefined) {
            CONFIG[key] = defaultValue
        } else if (Array.isArray(configValue) && Array.isArray(defaultValue)) {
            CONFIG[key] = Array.from(new Set( defaultValue.concat(configValue) ))
        } else if (typeof configValue == 'object' && typeof defaultValue == 'object') {
            mergeConfigWithDefaults(CONFIG[key], defaultValue)
        }
    }
}

function normalizeConfig(CONFIG = {}, RUN_PARAMS = {}) {
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

        if (fs.existsSync(input.js)) {
            const userJSEntryDirName = path.dirname(input.js)
            input.include
                ?   input.include.push( userJSEntryDirName )
                :   (input.include = [ userJSEntryDirName ])
        } else throw `build.input.js ->> [${input.js}] file doesn't exists.`
    }


    return { CONFIG, RUN_PARAMS }
}


export default normalizeConfig