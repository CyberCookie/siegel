//TODO blocked by ts: init global with ts types resolve
//TODO blocked by ts / eslint: zero config with ts / eslint

import { relative, join } from 'path'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { execSync as shell } from 'child_process'

import { PATHS, LOC_NAMES, DEFAULT_RUN_PARAMS } from '../core/constants.js'
import { isRunDirectly, requireJSON, globalNodeModulesPath, toPosixPath } from '../core/utils'

import type { PackageJson } from './types'


const packageJson = requireJSON(PATHS.packageJSON) as PackageJson
const {
    name: siegelPackageName,
    scripts: siegelPackageJSONScripts,
    type: siegelPackageType,
    engines: siegelPackageEngines,
    config: packageJsonConfig
} = packageJson


const toJSON = (data: any) => JSON.stringify(data, null, 4)

function main(isGlobal?: boolean) {
    if (DEFAULT_RUN_PARAMS._isSelfDevelopment) {
        throw new Error('Attempt to initialize demo_app inside siegel pckg')
    }


    const INIT_LOC_NAMES = {
        DEMO_APP_SERVER_DIR_NAME:   'server',
        DEMO_APP_SERVER_EXTENDER:   'app_server.ts',
        DEMO_APP_SIEGEL_CONFIG:     'siegel_config.ts',
        GITIGNOR_FILENAME:          '.gitignore',
        TS_GLOBALS:                 'global'
    } as const


    const userServerPath = join(PATHS.cwd, INIT_LOC_NAMES.DEMO_APP_SERVER_DIR_NAME)
    const userServerEntryPath = join(userServerPath, 'index.ts')

    const pathToSiegelAbsolute = isGlobal
        ?   `${globalNodeModulesPath()}/${siegelPackageName}`
        :   PATHS.packageRoot

    let pathToSiegelRelative = relative(PATHS.cwd, pathToSiegelAbsolute)
    pathToSiegelRelative[0] != '.' && (pathToSiegelRelative = `./${pathToSiegelRelative}`)


    const INIT_PATHS = {
        pathToSiegelRelative,
        pathToSiegelAbsolute,
        siegelDemoAppServerPath:        join(PATHS.demoProject, INIT_LOC_NAMES.DEMO_APP_SERVER_DIR_NAME),
        siegelDemoAppPathShift:         relative(PATHS.demoProject, PATHS.packageRoot),
        siegelLibPath:                  join(pathToSiegelRelative, LOC_NAMES.LIB_OUTPUT_DIRNAME),

        userServerEntryPath,
        userServerExtenderPath:         join(userServerPath, INIT_LOC_NAMES.DEMO_APP_SERVER_EXTENDER),
        userServerSiegelConfigPath:     join(userServerPath, INIT_LOC_NAMES.DEMO_APP_SIEGEL_CONFIG),
        userServerTSConfigPath:         join(userServerPath, LOC_NAMES.TS_JSON),
        userTSConfigPath:               join(PATHS.cwd, LOC_NAMES.TS_JSON),
        userTSGlobal:                   join(PATHS.cwd, LOC_NAMES.TS_GLOBAL_TYPES),
        userESLint:                     join(PATHS.cwd, LOC_NAMES.ESLINT_CONFIG_JS),
        userPackageJson:                join(PATHS.cwd, LOC_NAMES.PACKAGE_JSON),
        userGitIgnore:                  join(PATHS.cwd, INIT_LOC_NAMES.GITIGNOR_FILENAME),

        cwdRelativeUserServer:          relative(PATHS.cwd, userServerEntryPath)
    }



    function createDemoApp() {
        shell(`cp -r ${PATHS.demoProject}/. .`)

        const pathToSiegelGlobalTs = toPosixPath(
            isGlobal ? INIT_PATHS.pathToSiegelAbsolute : INIT_PATHS.pathToSiegelRelative
        )
        writeFileSync(INIT_PATHS.userTSGlobal, `import '${pathToSiegelGlobalTs}/${INIT_LOC_NAMES.TS_GLOBALS}'`)

        writeFileSync(INIT_PATHS.userGitIgnore, `${LOC_NAMES.NODE_MODULES}\n${LOC_NAMES.DEMO_APP_OUTPUT_DIR_NAME}`)
    }



    function modifyDemoAppServerSiegelPaths() {
        const replaceStringPart = toPosixPath(
            relative(INIT_PATHS.siegelDemoAppServerPath, PATHS.src)
        )

        const siegelEntryPointPath = isGlobal
            ?   INIT_PATHS.pathToSiegelAbsolute
            :   siegelPackageName


        ;([ INIT_PATHS.userServerEntryPath, INIT_PATHS.userServerExtenderPath, INIT_PATHS.userServerSiegelConfigPath ])
            .forEach(path => {
                const newFileContent = readFileSync(path, 'utf8')
                    .replace(replaceStringPart, siegelEntryPointPath)

                writeFileSync(path, newFileContent)
            })
    }



    function modifyTSConfigs() {
        const clientTSConfig = requireJSON(INIT_PATHS.userTSConfigPath)

        clientTSConfig.extends = clientTSConfig.extends.replace(
            INIT_PATHS.siegelDemoAppPathShift,
            INIT_PATHS.pathToSiegelRelative
        )

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



        const serverTSConfig = requireJSON(INIT_PATHS.userServerTSConfigPath)

        serverTSConfig.include[ serverTSConfig.include.length - 1 ]
            = relative(userServerPath, INIT_PATHS.userTSGlobal)

        writeFileSync(INIT_PATHS.userServerTSConfigPath, toJSON(serverTSConfig))


        return serverTSConfig.compilerOptions.outDir
    }


    function modifyESLintConfig() {
        const ESLintConfig = readFileSync(INIT_PATHS.userESLint, 'utf-8')

        const ESLintConfigModified = ESLintConfig.replace(
            INIT_PATHS.siegelDemoAppPathShift,
            siegelPackageName
        )

        writeFileSync(INIT_PATHS.userESLint, ESLintConfigModified)
    }


    function modifyPackageJson() {
        existsSync(INIT_PATHS.userPackageJson) || shell('npm init -y')


        const packageJsonConfigBootArgs = packageJsonConfig.boot.split(' ')
        packageJsonConfigBootArgs[ packageJsonConfigBootArgs.length - 1 ] = INIT_PATHS.cwdRelativeUserServer


        const scriptsToRemove = [ 'prepublishOnly', '__validate', '__transpile', 'start_mini' ]
        scriptsToRemove.forEach(script => {
            delete siegelPackageJSONScripts[script]
        })


        const servCommandRun = 'npm run serv'
        const deployCommand = 'deploy'
        const buildNodeCommand = 'build_node'

        siegelPackageJSONScripts[deployCommand] = siegelPackageJSONScripts[deployCommand]!
            .replace(servCommandRun, `npm run ${buildNodeCommand} && ${servCommandRun}`)

        siegelPackageJSONScripts[buildNodeCommand] = `npx tsc -p ./${INIT_LOC_NAMES.DEMO_APP_SERVER_DIR_NAME}`



        const targetPackageJSON = requireJSON(INIT_PATHS.userPackageJson) as PackageJson

        targetPackageJSON.scripts = siegelPackageJSONScripts
        targetPackageJSON.type = siegelPackageType
        targetPackageJSON.engines = siegelPackageEngines

        packageJsonConfig.boot = packageJsonConfigBootArgs.join(' ')
        targetPackageJSON.config = packageJsonConfig


        writeFileSync(INIT_PATHS.userPackageJson, toJSON(targetPackageJSON))
    }



    createDemoApp()
    modifyDemoAppServerSiegelPaths()
    modifyESLintConfig()
    modifyTSConfigs()
    modifyPackageJson()
}

isRunDirectly(import.meta) && main()


export default main