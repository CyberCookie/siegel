const existsSync            = require('fs').existsSync;
const { join, basename }    = require('path')

const { PATHS }             = require('../constants')



const targetPackageFilename = basename(PATHS.package)

const targetPackageLoc = join(process.cwd(), targetPackageFilename)
if (existsSync(targetPackageLoc)) {
    const targetPackage = require(targetPackageLoc)
    
    const {
        dependencies: targetDependencies = {},
        devDependencies: targetDevDependencies = {}
    } = targetPackage;
    
    
    const peerDependencies = require(PATHS.package).peerDependencies;

    let packagesToInstall = ''
    for (const dependency in peerDependencies) {
        const version = targetDevDependencies[dependency] || targetDependencies[dependency]

        let packageToInstall;
        if (version) {
            const parseVersionRegExp = /(\d*\.)(\d*\.)(\d*)/

            const parsedPackageVersion = peerDependencies[dependency].match(parseVersionRegExp)
            const parsedTargetPackageVersion = version.match(parseVersionRegExp)


            for (let i = 1; i < 4; i++) {
                if (parsedPackageVersion[i] > parsedTargetPackageVersion[i]) {
                    packageToInstall = dependency;
                    break
                }
            }
        } else packageToInstall = dependency;

        packageToInstall && (packagesToInstall += ` ${packageToInstall}`)
    }
    

    packagesToInstall && require('child_process')
        .execSync('npm i -D ' + packagesToInstall, { stdio: 'inherit' })
} else {
    console.error('%s wasn`t found in current dir', targetPackageFilename)
    process.exitCode = 1
}