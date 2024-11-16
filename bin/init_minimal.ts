import path from 'path'
import fs from 'fs'
import { execSync as shell } from 'child_process'

import { PATHS, LOC_NAMES, DEFAULT_RUN_PARAMS } from '../core/constants.js'
import { requireJSON } from '../core/utils'


function init() {
    if (DEFAULT_RUN_PARAMS._isSelfDevelopment) {
        throw new Error('Attempt to initialize demo_app inside siegel pckg')
    }


    shell(`cp -r ${PATHS.demoMiniProject}/. .`)


    const USER_TS_CONFIG_PATH = path.join(PATHS.cwd, LOC_NAMES.TS_JSON)
    const clientTSConfig = requireJSON(USER_TS_CONFIG_PATH)

    let pathToSiegelRelative = path.relative(PATHS.cwd, PATHS.packageRoot)
    pathToSiegelRelative[0] != '.' && (pathToSiegelRelative = `./${pathToSiegelRelative}`)


    clientTSConfig.extends = clientTSConfig.extends.replace(
        path.relative(PATHS.demoMiniProject, PATHS.packageRoot),
        pathToSiegelRelative
    )


    fs.writeFileSync(USER_TS_CONFIG_PATH, JSON.stringify(clientTSConfig, null, 4))
}


export default init