const { resolve } = require


/*
    requiring siegel: from within siegel itself or locally or globally.
    Choose the one you use.
*/
let devCorePath
try { devCorePath = resolve('../../src') }
catch(e) {
    try { devCorePath = resolve('siegel') }
    catch(e) {
        const globalNodeModulesPath = require('child_process')
            .execSync('npm root -g')
            .toString()
            .trim()

            devCorePath = resolve(globalNodeModulesPath + '/siegel')
    }
}


module.exports = devCorePath
export {}