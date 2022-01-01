/*
    requiring siegel: from within siegel itself or locally or globally.
    Choose the one you use.
*/
let siegel
try { siegel = require('../../src') }
catch(e) {
    try { siegel = require('siegel') }
    catch(e) {
        const globalNodeModulesPath = require('child_process')
            .execSync('npm root -g')
            .toString()
            .trim()

        siegel = require(globalNodeModulesPath + '/siegel')
    }
}


module.exports = siegel