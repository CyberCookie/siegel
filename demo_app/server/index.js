const RUN_ARGUMENTS = new Set(process.argv)

const isProd = RUN_ARGUMENTS.has('-p')
isProd && (process.env.NODE_ENV = 'production')


let devCore;
try { devCore = require('siegel') }
catch(e) {
    try {
        const globalNodeModulesPath = require('child_process')
            .execSync('npm root -g')
            .toString()

        devCore = require(globalNodeModulesPath + '/siegel')
    } catch(e) { devCore = require('../../src/index') }
}


devCore(
    require('./siegel_config'),
    {
        isProd,
        isServer: RUN_ARGUMENTS.has('-s'),
        isBuild: RUN_ARGUMENTS.has('-b')
    }
)