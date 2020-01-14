const devCore = require('./oswell_ui_dev_core/dev_tools')
const devCoreConfig = require('./oswell_ui_dev_core_config')


const RUN_ARGUMENTS = process.argv;


devCore(devCoreConfig, {
    isServer: RUN_ARGUMENTS.includes('-s'),
    isBuild: RUN_ARGUMENTS.includes('-b'),
    isProd: process.env.NODE_ENV == 'production'
})