const RUN_ARGUMENTS = process.argv;

const isProd = RUN_ARGUMENTS.includes('-p')
isProd && (process.env.NODE_ENV = 'production')


let devCore;
try { devCore = require('oswell_ui_dev_core') }
catch(e) { devCore = require('../../index.js') }


devCore(
    require('./oswell_ui_dev_core_config'),
    {
        isProd,
        isServer: RUN_ARGUMENTS.includes('-s'),
        isBuild: RUN_ARGUMENTS.includes('-b')
    }
)
