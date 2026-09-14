import { join, relative } from 'path'
import { writeFileSync } from 'fs'

import { LOC_NAMES, PATHS } from '../../../core/constants.js'
import { requireJSON } from '../../../core/utils'
import toJSON from './to_json'


import type { CompilerOptions } from 'typescript'


type TSConfig = {
    extends: string
    compilerOptions: CompilerOptions
    include: string[]
}
type ModifyTSConfigsParams = {
    DEMO_APP_PATH_SHIFT: string
    USER_TS_CONFIG_PATH: string
    USER_SERVER_TS_PATH?: string
    USER_CLIENT_TS_PATH?: string
}



async function modifyGlobalsPathAndSave(TS_CONFIG_PATH: string, content?: TSConfig) {
    const USER_TS_GlOBALS = join(PATHS.CWD, LOC_NAMES.TS_GLOBAL_TYPES)

    const serverTSConfig = content || await requireJSON<TSConfig>(TS_CONFIG_PATH)
    const { include } = serverTSConfig

    serverTSConfig.include[ include.length - 1 ]
        = relative(TS_CONFIG_PATH, USER_TS_GlOBALS)

    writeFileSync(TS_CONFIG_PATH, toJSON(serverTSConfig))
}

async function modifyTSConfigs(modifyParams: ModifyTSConfigsParams) {
    const {
        DEMO_APP_PATH_SHIFT, USER_TS_CONFIG_PATH, USER_SERVER_TS_PATH, USER_CLIENT_TS_PATH
    } = modifyParams

    let SIEGEL_RELATIVE_PATH = relative(PATHS.CWD, PATHS.PACKAGE_ROOT)
    SIEGEL_RELATIVE_PATH[0] !== '.' && (SIEGEL_RELATIVE_PATH = `./${SIEGEL_RELATIVE_PATH}`)



    const clientTSConfig = await requireJSON<TSConfig>(USER_TS_CONFIG_PATH)
    const { compilerOptions } = clientTSConfig

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


    await modifyGlobalsPathAndSave(USER_TS_CONFIG_PATH, clientTSConfig)
    USER_SERVER_TS_PATH && await modifyGlobalsPathAndSave(USER_SERVER_TS_PATH)
    USER_CLIENT_TS_PATH && await modifyGlobalsPathAndSave(USER_CLIENT_TS_PATH)
}


export default modifyTSConfigs
export type { TSConfig }