const RUN_ARGUMENTS = new Set(process.argv)

const isProd = RUN_ARGUMENTS.has('-p')
isProd && (process.env.NODE_ENV = 'production')


/*
    requiring siegel: from within siegel itself or locally or globally.
    Choose the one you use.
*/
let devCore
try { devCore = require('../../src') }
catch(e) {
    try { devCore = require('siegel') }
    catch(e) {
        const globalNodeModulesPath = require('child_process')
            .execSync('npm root -g')
            .toString()
            .trim()

        devCore = require(globalNodeModulesPath + '/siegel')
    }
}


devCore(
    require('./siegel_config'),
    {
        isProd,
        isServer: RUN_ARGUMENTS.has('-s'),
        isBuild: RUN_ARGUMENTS.has('-b')
    }
)