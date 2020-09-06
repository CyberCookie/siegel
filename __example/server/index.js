const RUN_ARGUMENTS = process.argv;

const isProd = RUN_ARGUMENTS.includes('-p')
isProd && (process.env.NODE_ENV = 'production')


let devCore;
try { devCore = require('siegel') }
catch(e) { devCore = require('../../src/index') }


devCore(
    require('./siegel_config'),
    {
        isProd,
        isServer: RUN_ARGUMENTS.includes('-s'),
        isBuild: RUN_ARGUMENTS.includes('-b')
    }
)