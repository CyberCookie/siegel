const { PATHS } = require('../constants')
const { dependencies, devDependencies } = require(PATHS.package)


const depsKeys = dependencies && Object.keys(dependencies).join(' ')
const devDepsKeys = devDependencies && Object.keys(devDependencies).join(' ')

if (depsKeys || devDepsKeys) {
    const shell = require('child_process').execSync;
    const shellOpts = { stdio: 'inherit' }

    shell(`npm remove ${depsKeys} ${devDepsKeys}`, shellOpts)

    depsKeys && shell(`npm i ${depsKeys}`, shellOpts)
    devDepsKeys && shell(`npm i -D ${devDepsKeys}`, shellOpts)
}