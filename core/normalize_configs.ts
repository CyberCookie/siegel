import path from 'path'
import fs from 'fs'

import { utils } from './index.js'
import { DEFAULT_RUN_PARAMS, DEFAULT_CONFIG } from './constants.js'

import type { BuildConfigsMerged } from './client_build/types'
import type { Config, ConfigFinal, RunParams, RunParamsFinal } from './types'


function mergeConfigWithDefaults(CONFIG: Indexable, DEFAULT_CONFIG: Indexable) {
    for (const key in DEFAULT_CONFIG) {
        const defaultValue = DEFAULT_CONFIG[key as keyof Config]
        const configValue = CONFIG[key as keyof Config]

        if (!utils.is.isExists(configValue)) {
            CONFIG[key] = defaultValue

        } else if (Array.isArray(configValue) && Array.isArray(defaultValue)) {
            CONFIG[key] = Array.from(new Set( defaultValue.concat(configValue) ))

        } else if (typeof configValue == 'object' && typeof defaultValue == 'object') {
            mergeConfigWithDefaults(CONFIG[key], defaultValue)
        }
    }
}

function normalizeConfig(CONFIG: Config = {}, RUN_PARAMS: RunParams = {}) {
    if (RUN_PARAMS) mergeConfigWithDefaults(RUN_PARAMS, DEFAULT_RUN_PARAMS)
    else RUN_PARAMS = DEFAULT_RUN_PARAMS

    const { isProd, isServer, isBuild } = RUN_PARAMS as RunParamsFinal
    ;(RUN_PARAMS as RunParamsFinal)._isDevServer = !isProd && isServer



    let stringConfig
    if (typeof CONFIG == 'string') {
        stringConfig = CONFIG
        CONFIG = {}
    }

    mergeConfigWithDefaults(CONFIG, DEFAULT_CONFIG)

    if (isBuild) {
        const { input, output } = CONFIG.build as BuildConfigsMerged


        ;(output as ConfigFinal['build']['output']).filenames = output.filenames[ isProd ? 'PROD' : 'DEV' ]!

        stringConfig && (input.js = stringConfig)

        if (fs.existsSync(input.js)) {
            const userJSEntryDirName = path.dirname(input.js)
            input.include
                ?   input.include.push( userJSEntryDirName )
                :   (input.include = [ userJSEntryDirName ])

        } else throw `build.input.js ->> [${input.js}] file doesn't exists.`
    }


    return {
        CONFIG: CONFIG as ConfigFinal,
        RUN_PARAMS: RUN_PARAMS as RunParamsFinal
    }
}


export default normalizeConfig