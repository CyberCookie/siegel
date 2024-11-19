import path from 'path'
import fs from 'fs'
import { execSync as shell } from 'child_process'

import { PATHS, LOC_NAMES, DEFAULT_RUN_PARAMS, DEFAULT_CONFIG } from '../core/constants.js'
import { requireJSON, toPosixPath } from '../core/utils'

import type { PackageJson } from './types'


const packageJson = requireJSON(PATHS.packageJSON) as PackageJson
const {
    name: siegelPackageName,
    scripts: siegelPackageJSONScripts,
    type: siegelPackageType,
    engines: siegelPackageEngines
} = packageJson


function init(isMiniServ: boolean) {
    if (DEFAULT_RUN_PARAMS._isSelfDevelopment) {
        throw new Error('Attempt to initialize demo_app inside siegel pckg')
    }


    const INIT_LOC_NAMES = {
        MINI_DEMO_APP_SERVER:   'server.ts',
        MINI_DEMO_APP_CLIENT:    path.parse(DEFAULT_CONFIG.build.input.js).base,
        TS_GLOBALS:             'global'
    } as const


    let pathToSiegelRelative = path.relative(PATHS.cwd, PATHS.packageRoot)
    pathToSiegelRelative[0] != '.' && (pathToSiegelRelative = `./${pathToSiegelRelative}`)

    const INIT_PATHS = {
        pathToSiegelRelative,
        siegelDemoAppPathShift:     path.relative(PATHS.demoMiniProject, PATHS.packageRoot),
        userServerEntryPath:        path.join(PATHS.cwd, INIT_LOC_NAMES.MINI_DEMO_APP_SERVER),
        userServerTSConfigPath:     path.join(PATHS.cwd, LOC_NAMES.TS_JSON),
        userTSGlobal:               path.join(PATHS.cwd, LOC_NAMES.TS_GLOBAL_TYPES),
        userESLint:                 path.join(PATHS.cwd, LOC_NAMES.ESLINT_CONFIG_JS),
        userPackageJson:            path.join(PATHS.cwd, LOC_NAMES.PACKAGE_JSON),
        userGitIgnore:              path.join(PATHS.cwd, '.gitignore')
    }


    let copyFilesString = `${INIT_LOC_NAMES.MINI_DEMO_APP_CLIENT},${LOC_NAMES.TS_JSON}`
    isMiniServ && (copyFilesString += `,${INIT_LOC_NAMES.MINI_DEMO_APP_SERVER}`)
    shell(`cp -r ${PATHS.demoMiniProject}/{${copyFilesString}} .`)

    const pathToSiegelGlobalTs = toPosixPath(INIT_PATHS.pathToSiegelRelative)
    fs.writeFileSync(INIT_PATHS.userTSGlobal, `import '${pathToSiegelGlobalTs}/${INIT_LOC_NAMES.TS_GLOBALS}'`)

    fs.writeFileSync(INIT_PATHS.userGitIgnore, `${LOC_NAMES.NODE_MODULES}\n${LOC_NAMES.DEMO_APP_OUTPUT_DIR_NAME}`)


    if (isMiniServ) {
        const serverContent = fs.readFileSync(INIT_PATHS.userServerEntryPath, 'utf8')

        const newFileContent = serverContent.replace(
            toPosixPath(
                path.relative(PATHS.demoMiniProject, PATHS.src)
            ),
            siegelPackageName
        )

        fs.writeFileSync(INIT_PATHS.userServerEntryPath, newFileContent)
    }


    const clientTSConfig = requireJSON(INIT_PATHS.userServerTSConfigPath)
    clientTSConfig.extends = clientTSConfig.extends.replace(
        INIT_PATHS.siegelDemoAppPathShift,
        INIT_PATHS.pathToSiegelRelative
    )

    if (INIT_PATHS.siegelDemoAppPathShift) {
        const { include } = clientTSConfig
        include[ include.length - 1 ] = include.at(-1)
            .replace(`${INIT_PATHS.siegelDemoAppPathShift}/`, '')
    }

    fs.writeFileSync(INIT_PATHS.userServerTSConfigPath, JSON.stringify(clientTSConfig, null, 4))



    const clientPackageJson = requireJSON(INIT_PATHS.userPackageJson) as Partial<PackageJson>
    clientPackageJson.type = siegelPackageType
    clientPackageJson.engines = siegelPackageEngines
    clientPackageJson.scripts = {
        start: siegelPackageJSONScripts['start_mini']!
            .replace(
                LOC_NAMES.BIN_DIR_NAME,
                path.relative(PATHS.cwd, PATHS.binOutput)
            )
            .replace(`${LOC_NAMES.DEMO_MINI_APP_DIR_NAME}/`, '')
            .replace(/\s--c.*$/g, '')
    }

    fs.writeFileSync(INIT_PATHS.userPackageJson, JSON.stringify(clientPackageJson, null, 4))
}


export default init