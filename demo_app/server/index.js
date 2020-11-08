const RUN_ARGUMENTS = new Set(process.argv)

const isProd = RUN_ARGUMENTS.has('-p')
isProd && (process.env.NODE_ENV = 'production')


/*
    require siegel from within siegel itself, locally or globally.
    Choose the one you use.
*/

let devCore;
try { devCore = require('../../src/index') }
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