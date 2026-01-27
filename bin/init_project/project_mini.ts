import { relative, join } from 'path'
import { writeFileSync } from 'fs'

import { PATHS, LOC_NAMES, IS_SELF_DEVELOPMENT } from '../../core/constants.js'
import { requireJSON, isRunDirectly, parseCommandLineArgs } from '../../core/utils'
import { siegelPackageJsonData, INIT_COMMON_LOC_NAMES, INIT_COMMON_PATHS } from './constants.js'
import { toJSON, downloadGitDir, modifyServerPaths, modifyTsConfigs } from './utils'

import type { PackageJson } from './types'


const {
    packageType, packageEngines, packageScripts
} = siegelPackageJsonData


function main(isMiniServ: boolean) {
    if (IS_SELF_DEVELOPMENT) {
        throw new Error('Attempt to initialize demo_app inside siegel pckg')
    }

    const DEMO_APP_PATH_SHIFT =     relative(PATHS.DEMO_MINI_PROJECT, PATHS.PACKAGE_ROOT)



    function createDemoApp() {
        downloadGitDir(
            LOC_NAMES.DEMO_APP_MINI_DIR_NAME,
            isMiniServ
                ?   undefined
                :   filePath => filePath.endsWith(INIT_COMMON_LOC_NAMES.DEMO_APP_SERVER_EXTENDER)
        )

        const tsGlobalsImportString = `import '${INIT_COMMON_PATHS.SIEGEL_TS_GLOBALS_PATH}/${INIT_COMMON_LOC_NAMES.TS_GLOBALS_FILENAME}'`
        writeFileSync(INIT_COMMON_PATHS.USER_TS_GlOBALS, tsGlobalsImportString)

        writeFileSync(INIT_COMMON_PATHS.USER_GIT_IGNORE, `${LOC_NAMES.NODE_MODULES}\n${LOC_NAMES.DEMO_APP_OUTPUT_DIR_NAME}`)
    }


    function modifyPackageJson() {
        const clientPackageJson = requireJSON(INIT_COMMON_PATHS.USER_PACKAGE_JSON) as Partial<PackageJson>

        clientPackageJson.type = packageType
        clientPackageJson.engines = packageEngines
        clientPackageJson.scripts = {
            start: packageScripts['start_mini']!
                .replace(
                    LOC_NAMES.BIN_DIR_NAME,
                    relative(PATHS.CWD, PATHS.BIN_OUTPUT)
                )
                .replace(`${LOC_NAMES.DEMO_APP_MINI_DIR_NAME}/`, '')
                .replace(/\s--c.*$/g, ''),

            start_client: 'npx siegel run'
        }

        writeFileSync(INIT_COMMON_PATHS.USER_PACKAGE_JSON, toJSON(clientPackageJson))
    }



    createDemoApp()

    isMiniServ && modifyServerPaths({
        DEMO_PROJECT_SERVER_PATH: PATHS.DEMO_MINI_PROJECT,
        PATHS_TO_UPDATE: [
            join(PATHS.CWD, INIT_COMMON_LOC_NAMES.DEMO_APP_SERVER_EXTENDER)
        ]
    })

    modifyTsConfigs({
        DEMO_APP_PATH_SHIFT,
        USER_TS_CONFIG_PATH: join(PATHS.CWD, LOC_NAMES.TS_JSON)
    })

    modifyPackageJson()
}

if (isRunDirectly(import.meta)) {
    const { CLIParamsValues } = parseCommandLineArgs(process.argv)
    main(
        !!(CLIParamsValues['-s'] || CLIParamsValues['--server'])
    )
}


export default main