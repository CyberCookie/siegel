'use strict'

import { relative, join } from 'path'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { execSync as shell } from 'child_process'

import { isRunDirectly, requireJSON, globalNodeModulesPath } from '../core/utils/index.js'
import { PATHS, LOC_NAMES, DEFAULT_RUN_PARAMS } from '../core/constants.js'


const {
    name: siegelPackageName,
    scripts: siegelPackageJSONScripts,
    type: siegelPackageType,
    config: packageJsonConfig
} = requireJSON(PATHS.packageJSON)


const toJSON = (data: any) => JSON.stringify(data, null, 4)

function main(isGlobal?: boolean) {
    if (DEFAULT_RUN_PARAMS._isSelfDevelopment) {
        throw new Error('Attempt to initialize demo_app inside siegel pckg')
    }


    const userServerPath = join(PATHS.cwd, 'server')
    const userServerEntryPath = join(userServerPath, 'index.ts')

    const pathToSiegelAbsolute = isGlobal
        ?   `${globalNodeModulesPath()}/${siegelPackageName}`
        :   PATHS.packageRoot

    const pathToSiegelRelative = relative(PATHS.cwd, pathToSiegelAbsolute)

    const INIT_PATHS = {
        pathToSiegelRelative,
        pathToSiegelAbsolute,
        siegelEsLint:                   join(isGlobal ? pathToSiegelAbsolute : pathToSiegelRelative, LOC_NAMES.ESLINT_JSON),
        siegelDemoAppServerPath:        join(PATHS.demoProject, 'server'),
        siegelDemoAppPathShift:         relative(PATHS.demoProject, PATHS.packageRoot),
        siegelLibPath:                  join(pathToSiegelRelative, LOC_NAMES.LIB_OUTPUT_DIRNAME),

        userServerEntryPath,
        userServerExtenderPath:         join(userServerPath, 'app_server.ts'),
        userServerSiegelConfigPath:     join(userServerPath, 'siegel_config.ts'),
        userTSConfigPath:               join(PATHS.cwd, LOC_NAMES.TS_JSON),
        userTSGlobal:                   join(PATHS.cwd, LOC_NAMES.TS_GLOBAL_TYPES),
        userESLint:                     join(PATHS.cwd, LOC_NAMES.ESLINT_JSON),
        userPackageJson:                join(PATHS.cwd, LOC_NAMES.PACKAGE_JSON),

        cwdRelativeUserServer:          relative(PATHS.cwd, userServerEntryPath)
    }



    function createDemoApp() {
        // Copy demo_app
        shell(`cp -r ${PATHS.demoProject}/. .`)

        // Create global.d.ts
        writeFileSync(
            INIT_PATHS.userTSGlobal,
            `import '${ isGlobal ? INIT_PATHS.pathToSiegelAbsolute : INIT_PATHS.pathToSiegelRelative }'`
        )

        // Copy Eslint jsons
        shell(`cp ${ PATHS.packageRoot }/{${ LOC_NAMES.ESLINT_JSON },${ LOC_NAMES.TS_ESLINT_JSON }} .`)
    }



    function modifyDemoAppServerSiegelPaths() {
        const replaceStringPart = relative(
            INIT_PATHS.siegelDemoAppServerPath,
            `${PATHS.src}/index.js`
        )

        const siegelEntryPointPath = isGlobal
            ?   pathToSiegelAbsolute
            :   siegelPackageName


        ;([ INIT_PATHS.userServerEntryPath, INIT_PATHS.userServerExtenderPath, INIT_PATHS.userServerSiegelConfigPath ])
            .forEach(path => {
                const newFileContent = readFileSync(path, 'utf8')
                    .replace(replaceStringPart, siegelEntryPointPath)

                writeFileSync(path, newFileContent)
            })
    }



    function modifyTSConfig() {
        const clientTSConfig = requireJSON(INIT_PATHS.userTSConfigPath)

        const newExtendPath = clientTSConfig.extends.replace(
            INIT_PATHS.siegelDemoAppPathShift,
            INIT_PATHS.pathToSiegelRelative
        )
        clientTSConfig.extends = `./${newExtendPath}`

        const paths = clientTSConfig.compilerOptions.paths
        for (const alias in paths) {
            paths[alias][0] = paths[alias][0].replace(
                INIT_PATHS.siegelDemoAppPathShift,
                INIT_PATHS.siegelLibPath
            )
        }

        if (INIT_PATHS.siegelDemoAppPathShift) {
            const { include } = clientTSConfig
            include[ include.length - 1 ] = include.at(-1)
                .replace(`${INIT_PATHS.siegelDemoAppPathShift}/`, '')
        }

        writeFileSync(INIT_PATHS.userTSConfigPath, toJSON(clientTSConfig))
    }


    function modifyESLintConfig() {
        const ESLintConfig = requireJSON(INIT_PATHS.userESLint)

        ESLintConfig.extends.push(
            INIT_PATHS.siegelEsLint[0] == '.' || isGlobal
                ?   INIT_PATHS.siegelEsLint
                :   `./${INIT_PATHS.siegelEsLint}`
        )
        ESLintConfig.ignorePatterns.pop()
        ESLintConfig.rules = {}

        writeFileSync(INIT_PATHS.userESLint, toJSON(ESLintConfig))
    }


    function modifyPackageJson() {
        existsSync(INIT_PATHS.userPackageJson) || shell('npm init -y')
        const targetPackageJSON = requireJSON(INIT_PATHS.userPackageJson)


        targetPackageJSON.type = siegelPackageType

        const internalPackageScripts = [ 'prepublishOnly', '__validate', '__transpile' ]
        internalPackageScripts.forEach(command => {
            delete siegelPackageJSONScripts[command]
        })

        const packageJsonConfigBootArgs = packageJsonConfig.boot.split(' ')
        packageJsonConfigBootArgs[ packageJsonConfigBootArgs.length - 1 ] = INIT_PATHS.cwdRelativeUserServer

        const packageJsonConfigBootString = packageJsonConfigBootArgs.join(' ')

        for (const command in siegelPackageJSONScripts) {
            const siegelPackageJSONCommand = siegelPackageJSONScripts[command]

            siegelPackageJSONScripts[command] = siegelPackageJSONCommand.replace(
                '$npm_package_config_boot',
                packageJsonConfigBootString
            )
        }
        targetPackageJSON.scripts = siegelPackageJSONScripts

        writeFileSync(INIT_PATHS.userPackageJson, toJSON(targetPackageJSON))
    }



    createDemoApp()
    modifyDemoAppServerSiegelPaths()
    modifyTSConfig()
    modifyESLintConfig()
    modifyPackageJson()
}

isRunDirectly(import.meta) && main()


export default main