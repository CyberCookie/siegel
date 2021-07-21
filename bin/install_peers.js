const { existsSync }        = require('fs')

const { PATHS }             = require('../cjs/constants')


function main() {
    if (existsSync(PATHS.cwdPackageJSON)) {
        const userPackageJSON = require(PATHS.cwdPackageJSON)

        const {
            dependencies: userDependencies = {},
            devDependencies: userDevDependencies = {}
        } = userPackageJSON


        const { peerDependencies } = require(PATHS.package)

        const parseVersionRegExp = /(\d*\.)(\d*\.)(\d*)/

        let packagesToInstall = ''
        for (const dependency in peerDependencies) {
            const version = userDevDependencies[dependency] || userDependencies[dependency]

            let packageToInstall
            if (version) {
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