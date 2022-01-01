'use strict'

const { PATHS }         = require('../cjs/constants')
const { existsSync }    = require('fs')


function main() {
    if (existsSync(PATHS.cwdPackageJSON)) {
        const { dependencies, devDependencies } = require(PATHS.cwdPackageJSON)

        const depsKeys = dependencies && Object.keys(dependencies).join(' ')
        const devDepsKeys = devDependencies && Object.keys(devDependencies).join(' ')

        if (depsKeys || devDepsKeys) {
            const shell = require('child_process').execSync
            const shellOpts = { stdio: 'inherit' }

            shell(`npm remove ${depsKeys} ${devDepsKeys}`, shellOpts)

            depsKeys && shell(`npm i ${depsKeys}`, shellOpts)
            devDepsKeys && shell(`npm i -D ${devDepsKeys}`, shellOpts)
        }
    } else {
        console.error('%s does not exists.', PATHS.cwdPackageJSON)
        process.exitCode = 1
    }
}


require.main == module
    ?   main()
    :   (module.exports = main)