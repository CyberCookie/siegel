const { dirname, join, isAbsolute } = require('path')
const existsSync                    = require('fs').existsSync;

const CONSTANTS                     = require('./constants')


function mergeConfigWithDefaults(CONFIG, DEFAULT_CONFIG) {
    for (const key in DEFAULT_CONFIG) {
        const value = DEFAULT_CONFIG[key]

        if (CONFIG[key] == undefined) {
            CONFIG[key] = value
        } else if (CONFIG[key].constructor.name == 'Object' && value.constructor.name == 'Object') {
            mergeConfigWithDefaults(CONFIG[key], value)
        }
    }
}


//TODO:
module.exports = (CONFIG = {}, RUN_PARAMS = {}) => {
    if (RUN_PARAMS) mergeConfigWithDefaults(RUN_PARAMS, CONSTANTS.DEFAULT_RUN_PARAMS)
    else RUN_PARAMS = CONSTANTS.DEFAULT_RUN_PARAMS;

    RUN_PARAMS.isDevServer = !RUN_PARAMS.isProd && RUN_PARAMS.isServer


    
    if (RUN_PARAMS.isBuild && typeof CONFIG == 'string') {
        CONFIG = {
            build: {
                input: {
                    js: isAbsolute(CONFIG)
                        ?   CONFIG
                        :   join(dirname(process.argv[1]), CONFIG)
                }
            }
        }
    }

    mergeConfigWithDefaults(CONFIG, CONSTANTS.DEFAULT_CONFIG)

    if (RUN_PARAMS.isBuild) {
        const { input, output } = CONFIG.build;

        
        if (!input.js) { throw 'no build.input.js provided' }
        
        if (!(output && input.include)) {
            const inputDirName = dirname(input.js)
            
            
            output || (
                CONFIG.build.output = existsSync(inputDirName, 'package.json')
                    ?   join(inputDirName, 'dist')
                    :   join(inputDirName, '..', 'dist')
            )
                
            input.include || (input.include = [ inputDirName ])
            input.include.push(CONSTANTS.PATHS.uiCore)
        }
    }


    return { CONFIG, RUN_PARAMS }
}