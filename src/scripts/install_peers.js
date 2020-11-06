const { existsSync }        = require('fs')

const { PATHS }             = require('../constants')


function main() {
    if (existsSync(PATHS.cwdPackageJSON)) {
        const targetPackage = require(PATHS.cwdPackageJSON)
        
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
        console.error('%s does not exists.', PATHS.cwdPackageJSON)
        process.exitCode = 1
    }
}



module.parent
    ?   (module.exports = main)
    :   main()