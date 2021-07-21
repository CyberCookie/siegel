const { INIT_CWD, PWD } = process.env
console.log('DEBUG: INIT_CWD: ', INIT_CWD)
console.log('DEBUG: PWD: ', PWD)
if (INIT_CWD && INIT_CWD != PWD) {
    process.chdir(INIT_CWD)
}
console.log('DEBUG: NEW PWD: ', process.env.PWD)

const { existsSync }        = require('fs')

const { PATHS }             = require('../cjs/constants')
console.log('DEBUG: PATHS: ', PATHS)

function main() {
    if (existsSync(PATHS.cwdPackageJSON)) {
        const targetPackage = require(PATHS.cwdPackageJSON)

        const {
            dependencies: targetDependencies = {},
            devDependencies: targetDevDependencies = {}
        } = targetPackage


        const { peerDependencies } = require(PATHS.package)

        let packagesToInstall = ''
        for (const dependency in peerDependencies) {
            const version = targetDevDependencies[dependency] || targetDependencies[dependency]

            let packageToInstall
            if (version) {
                const parseVersionRegExp = /(\d*\.)(\d*\.)(\d*)/

                const parsedPackageVersion = peerDependencies[dependency].match(parseVersionRegExp)
                const parsedTargetPackageVersion = version.match(parseVersionRegExp)


                for (let i = 1; i < 4; i++) {
                    if (parsedPackageVersion[i] > parsedTargetPackageVersion[i]) {
                        packageToInstall = dependency
                        break
                    }
                }
            } else packageToInstall = dependency

            packageToInstall && (packagesToInstall += ` ${packageToInstall}`)
        }


        packagesToInstall && require('child_process')
            .execSync('npm i -D ' + packagesToInstall, { stdio: 'inherit' })
    } else {
        console.error('%s does not exists.', PATHS.cwdPackageJSON)
        process.exitCode = 1
    }
}


require.main == module
    ?   main()
    :   (module.exports = main)