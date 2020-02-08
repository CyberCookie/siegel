const RUN_ARGUMENTS = process.argv;

const isProd = RUN_ARGUMENTS.includes('-p')
isProd && (process.env.NODE_ENV = 'production')


const devCore = require('../oswell_ui_dev_core/dev_tools')
const devCoreConfig = require('./oswell_ui_dev_core_config')



devCore(devCoreConfig, {
    isProd,
    isServer: RUN_ARGUMENTS.includes('-s'),
    isBuild: RUN_ARGUMENTS.includes('-b')
})