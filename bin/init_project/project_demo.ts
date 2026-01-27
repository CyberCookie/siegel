//TODO blocked by ts / eslint: zero config with ts / eslint

import { relative, join } from 'path'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { execSync as shell } from 'child_process'

import { PATHS, LOC_NAMES, IS_SELF_DEVELOPMENT } from '../../core/constants.js'
import { isRunDirectly, requireJSON } from '../../core/utils'
import { siegelPackageJsonData, INIT_COMMON_LOC_NAMES, INIT_COMMON_PATHS } from './constants.js'
import { toJSON, downloadGitDir, modifyServerPaths, modifyTsConfigs } from './utils'

import type { PackageJson } from './types'


const {
    packageName, packageType, packageConfig, packageEngines, packageScripts
} = siegelPackageJsonData


function main() {
    if (IS_SELF_DEVELOPMENT) {
        throw new Error('Attempt to initialize demo_app inside siegel pckg')
    }

    const DEMO_APP_SERVER_DIR_NAME =    'server'
    const DEMO_APP_PATH_SHIFT =         relative(PATHS.DEMO_PROJECT, PATHS.PACKAGE_ROOT)
    const USER_SERVER_PATH =            join(PATHS.CWD, DEMO_APP_SERVER_DIR_NAME)



    function createDemoApp() {
        downloadGitDir(LOC_NAMES.DEMO_APP_DIR_NAME)

        const tsGlobalsImportString
            = `import '${INIT_COMMON_PATHS.SIEGEL_TS_GLOBALS_PATH}/${INIT_COMMON_LOC_NAMES.TS_GLOBALS_FILENAME}'`
        writeFileSync(INIT_COMMON_PATHS.USER_TS_GlOBALS, tsGlobalsImportString)

        writeFileSync(INIT_COMMON_PATHS.USER_GIT_IGNORE, `${LOC_NAMES.NODE_MODULES}\n${LOC_NAMES.DEMO_APP_OUTPUT_DIR_NAME}`)
    }


    function modifyESLintConfig() {
        const ESLintConfig = readFileSync(INIT_COMMON_PATHS.USER_ESLINT, 'utf8')

        const ESLintConfigModified = ESLintConfig.replace(
            DEMO_APP_PATH_SHIFT,
            packageName
        )

        writeFileSync(INIT_COMMON_PATHS.USER_ESLINT, ESLintConfigModified)
    }


    function modifyPackageJson() {
        existsSync(INIT_COMMON_PATHS.USER_PACKAGE_JSON) || shell('npm init -y')

        const scriptsToRemove = [ 'prepublishOnly', '__validate', '__transpile', 'start_mini' ]
        scriptsToRemove.forEach(script => {
            delete packageScripts[script]
        })


        const servCommandRun = 'npm run serv'
        const deployCommand = 'deploy'
        const buildNodeCommand = 'build_node'

        packageScripts[deployCommand] = packageScripts[deployCommand]!
            .replace(servCommandRun, `npm run ${buildNodeCommand} && ${servCommandRun}`)

        packageScripts[buildNodeCommand] = `npx tsc -p ./${DEMO_APP_SERVER_DIR_NAME}`


        const clientPackageJson = requireJSON(INIT_COMMON_PATHS.USER_PACKAGE_JSON) as PackageJson

        clientPackageJson.type = packageType
        clientPackageJson.engines = packageEngines
        clientPackageJson.scripts = packageScripts

        const packageJsonConfigBootArgs = packageConfig.boot.split(' ')

        packageJsonConfigBootArgs[ packageJsonConfigBootArgs.length - 1 ]
            = relative(PATHS.CWD, join(USER_SERVER_PATH, 'index.ts'))

        clientPackageJson.config = {
            boot: packageJsonConfigBootArgs.join(' ')
        }


        writeFileSync(INIT_COMMON_PATHS.USER_PACKAGE_JSON, toJSON(clientPackageJson))
    }



    createDemoApp()

    modifyServerPaths({
        DEMO_PROJECT_SERVER_PATH: join(PATHS.DEMO_PROJECT, DEMO_APP_SERVER_DIR_NAME),
        PATHS_TO_UPDATE: [
            join(USER_SERVER_PATH, 'index.ts'),
            join(USER_SERVER_PATH, INIT_COMMON_LOC_NAMES.DEMO_APP_SERVER_EXTENDER)
        ]
    })

    modifyTsConfigs({
        DEMO_APP_PATH_SHIFT, USER_SERVER_PATH,
        USER_TS_CONFIG_PATH: join(PATHS.CWD, LOC_NAMES.TS_JSON)
    })

    modifyESLintConfig()
    modifyPackageJson()
}

isRunDirectly(import.meta) && main()


export default main