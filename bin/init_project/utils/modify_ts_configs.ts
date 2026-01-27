import { join, relative } from 'path'
import { writeFileSync } from 'fs'

import { LOC_NAMES, PATHS } from '../../../core/constants.js'
import { requireJSON } from '../../../core/utils'
import toJSON from './to_json'

import type { TSConfig, ModifyTSConfigsParams } from './types'


function modifyTSConfigs(modifyParams: ModifyTSConfigsParams) {
    const {
        DEMO_APP_PATH_SHIFT, USER_TS_CONFIG_PATH, USER_SERVER_PATH
    } = modifyParams

    let SIEGEL_RELATIVE_PATH = relative(PATHS.CWD, PATHS.PACKAGE_ROOT)
    SIEGEL_RELATIVE_PATH[0] != '.' && (SIEGEL_RELATIVE_PATH = `./${SIEGEL_RELATIVE_PATH}`)



    const clientTSConfig = requireJSON<TSConfig>(USER_TS_CONFIG_PATH)
    const { compilerOptions, include } = clientTSConfig

    clientTSConfig.extends
        = clientTSConfig.extends.replace(DEMO_APP_PATH_SHIFT, SIEGEL_RELATIVE_PATH)

    if (compilerOptions.paths) {
        const SIEGEL_LIB_PATH = join(SIEGEL_RELATIVE_PATH, LOC_NAMES.LIB_OUTPUT_DIRNAME)

        Object.values(compilerOptions.paths)
            .forEach(aliasValue => {
                aliasValue[0] = aliasValue[0].replace(
                    DEMO_APP_PATH_SHIFT,
                    SIEGEL_LIB_PATH
                )
            })
    }

    if (DEMO_APP_PATH_SHIFT) {
        include[ include.length - 1 ] = include.at(-1)!
            .replace(`${DEMO_APP_PATH_SHIFT}/`, '')
    }

    writeFileSync(USER_TS_CONFIG_PATH, toJSON(clientTSConfig))



    if (USER_SERVER_PATH) {
        const USER_SERVER_TS_CONFIG_PATH = join(USER_SERVER_PATH, LOC_NAMES.TS_JSON)
        const USER_TS_GlOBALS = join(PATHS.CWD, LOC_NAMES.TS_GLOBAL_TYPES)

        const serverTSConfig = requireJSON<TSConfig>(USER_SERVER_TS_CONFIG_PATH)
        const { include } = serverTSConfig

        serverTSConfig.include[ include.length - 1 ]
            = relative(USER_SERVER_PATH, USER_TS_GlOBALS)

        writeFileSync(USER_SERVER_TS_CONFIG_PATH, toJSON(serverTSConfig))
    }
}


export default modifyTSConfigs