//TODO blocked by ts: init global with ts types resolve
//TODO blocked by ts / eslint: zero config with ts / eslint

import { relative, join } from 'path'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { execSync as shell } from 'child_process'

import { isRunDirectly, requireJSON, globalNodeModulesPath, toPosixPath } from '../core/utils'
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


    const INIT_LOC_NAMES = {
        DEMO_APP_SERVER_DIR_NAME:   'server',
        DEMO_APP_SERVER_EXTENDER:   'app_server.ts',
        DEMO_APP_SIEGEL_CONFIG:     'siegel_config.ts'
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
        siegelEsLint:                   join(isGlobal ? pathToSiegelAbsolute : pathToSiegelRelative, LOC_NAMES.ESLINT_JSON),
        siegelDemoAppServerPath:        join(PATHS.demoProject, INIT_LOC_NAMES.DEMO_APP_SERVER_DIR_NAME),
        siegelDemoAppPathShift:         relative(PATHS.demoProject, PATHS.packageRoot),
        siegelLibPath:                  join(pathToSiegelRelative, LOC_NAMES.LIB_OUTPUT_DIRNAME),

        userServerEntryPath,
        userServerExtenderPath:         join(userServerPath, INIT_LOC_NAMES.DEMO_APP_SERVER_EXTENDER),
        userServerSiegelConfigPath:     join(userServerPath, INIT_LOC_NAMES.DEMO_APP_SIEGEL_CONFIG),
        userServerTSConfigPath:         join(userServerPath, LOC_NAMES.TS_JSON),
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
        const pathToSiegelGlobalTs = toPosixPath(
            isGlobal ? INIT_PATHS.pathToSiegelAbsolute : INIT_PATHS.pathToSiegelRelative
        ) + '/global'
        writeFileSync(INIT_PATHS.userTSGlobal, `import '${pathToSiegelGlobalTs}'`)

        // Copy Eslint jsons
        shell(`cp ${ PATHS.packageRoot }/{${ LOC_NAMES.ESLINT_JSON },${ LOC_NAMES.TS_ESLINT_JSON }} .`)
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


        const packageJsonConfigBootArgs = packageJsonConfig.boot.split(' ')
        packageJsonConfigBootArgs[ packageJsonConfigBootArgs.length - 1 ] = INIT_PATHS.cwdRelativeUserServer


        const internalPackageScripts = [ 'prepublishOnly', '__validate', '__transpile' ]
        internalPackageScripts.forEach(command => {
            delete siegelPackageJSONScripts[command]
        })


        const servCommandRun = 'npm run serv'
        const deployCommand = 'deploy'
        const buildNodeCommand = 'build_node'

        siegelPackageJSONScripts[deployCommand] = siegelPackageJSONScripts[deployCommand]
            .replace(servCommandRun, `npm run ${buildNodeCommand} && ${servCommandRun}`)

        siegelPackageJSONScripts[buildNodeCommand] = `npx tsc -p ./${INIT_LOC_NAMES.DEMO_APP_SERVER_DIR_NAME}`



        const targetPackageJSON = requireJSON(INIT_PATHS.userPackageJson)

        targetPackageJSON.scripts = siegelPackageJSONScripts
        targetPackageJSON.type = siegelPackageType

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