// TODO blocked by ts / eslint: zero config with ts / eslint

import { relative, join } from 'path'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { execSync as shell } from 'child_process'

import { PATHS, LOC_NAMES, IS_SELF_DEVELOPMENT } from '../../core/constants'
import { serverUtils } from '../../core'
import { siegelPackageJsonData, INIT_COMMON_LOC_NAMES, INIT_COMMON_PATHS } from './constants'
import { toJSON, downloadGitDir, modifyTsConfigs } from './utils'

import type { PackageJson } from './types'


const { requireJSON } = serverUtils
const {
    packageName, packageType, packageConfig, packageEngines, packageScripts
} = siegelPackageJsonData


async function main() {
    if (IS_SELF_DEVELOPMENT) {
        throw new Error('Attempt to initialize demo_app inside siegel pckg')
    }

    const DEMO_APP_SERVER_DIR_NAME =    'server'
    const DEMO_APP_CLIENT_DIR_NAME =    'client'
    const DEMO_APP_PATH_SHIFT =         relative(PATHS.DEMO_PROJECT, PATHS.PACKAGE_ROOT)
    const USER_SERVER_PATH =            join(PATHS.CWD, DEMO_APP_SERVER_DIR_NAME)



    function createDemoApp() {
        downloadGitDir(LOC_NAMES.DEMO_APP_DIR_NAME)

        writeFileSync(
            INIT_COMMON_PATHS.USER_TS_GlOBALS,
            `import '${INIT_COMMON_PATHS.SIEGEL_TS_GLOBALS_PATH}/${INIT_COMMON_LOC_NAMES.TS_GLOBALS_FILENAME}'`
        )
        writeFileSync(
            INIT_COMMON_PATHS.USER_GIT_IGNORE,
            `${LOC_NAMES.NODE_MODULES}\n${LOC_NAMES.DEMO_APP_OUTPUT_DIR_NAME}`
        )
    }


    function modifyESLintConfig() {
        const ESLintConfig = readFileSync(INIT_COMMON_PATHS.USER_ESLINT, 'utf8')

        const ESLintConfigModified = ESLintConfig.replace(
            DEMO_APP_PATH_SHIFT,
            packageName
        )

        writeFileSync(INIT_COMMON_PATHS.USER_ESLINT, ESLintConfigModified)
    }


    async function modifyPackageJson() {
        existsSync(INIT_COMMON_PATHS.USER_PACKAGE_JSON) || shell('npm init -y')

        const scriptsToRemove = [
            'prepublishOnly',
            'start_mini', '__docs_gen', '__validate', '__test', '__transpile'
        ]
        scriptsToRemove.forEach(script => {
            delete packageScripts[script]
        })


        const servCommandRun = 'npm run serv'
        const deployCommand = 'deploy'
        const buildNodeCommand = 'build_node'

        packageScripts[deployCommand] = packageScripts[deployCommand]!
            .replace(servCommandRun, `npm run ${buildNodeCommand} && ${servCommandRun}`)

        packageScripts[buildNodeCommand] = `npx tsc -p ./${DEMO_APP_SERVER_DIR_NAME}`


        const clientPackageJson = await requireJSON<PackageJson>(INIT_COMMON_PATHS.USER_PACKAGE_JSON)

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

    await modifyTsConfigs({
        USER_CLIENT_TS_PATH: join(PATHS.CWD, DEMO_APP_CLIENT_DIR_NAME, LOC_NAMES.TS_JSON),
        USER_SERVER_TS_PATH: join(USER_SERVER_PATH, LOC_NAMES.TS_JSON),
        USER_TS_CONFIG_PATH: join(PATHS.CWD, LOC_NAMES.TS_JSON),
        DEMO_APP_PATH_SHIFT
    })

    modifyESLintConfig()

    await modifyPackageJson()
}

import.meta.main && await main()


export default main