const { dirname, join } = require('path')

const CONSTANTS = require('./constants')


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
module.exports = (CONFIG, RUN_PARAMS) => {
    if (!CONFIG) { throw 'no config provided' }

    if (typeof CONFIG == 'string') {
        const existsSync = require('fs').existsSync;
        const inputDirName = dirname(CONFIG)
        
        const output = existsSync(join(inputDirName, 'package.json'))
            ?   join(inputDirName, 'dist')
            :   join(inputDirName, '..', 'dist')


        CONFIG = {
            build: {
                input: { js: CONFIG },
                output
            }
        }
    } else if (!CONFIG.build) { throw 'no config build provided' }


    mergeConfigWithDefaults(CONFIG, CONSTANTS.DEFAULT_CONFIG)
        
    const { input, output } = CONFIG.build;

    if (!input) { throw 'no build.input provided' }
    if (!input.js) { throw 'no build.input.js provided' }
    if (!input.html) { throw 'no build.input.html provided' }
    if (!output) { throw 'no build.output provided' }

    input.include || (input.include = dirname(input.js))
    
    

    if (RUN_PARAMS) mergeConfigWithDefaults(RUN_PARAMS, CONSTANTS.DEFAULT_RUN_PARAMS)
    else RUN_PARAMS = CONSTANTS.DEFAULT_RUN_PARAMS;

    RUN_PARAMS.isDevServer = !RUN_PARAMS.isProd && RUN_PARAMS.isServer
}