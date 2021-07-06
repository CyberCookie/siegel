const { existsSync }        = require('fs')

const { PATHS }             = require('../cjs/constants')


function main() {
    console.log(process.env, PATHS)
    // Skip local install
    const { INIT_CWD, PWD } = process.env
    if (!INIT_CWD || INIT_CWD == PWD || !INIT_CWD.indexOf(PWD)) {
        process.exitCode = 0
        return
    }

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