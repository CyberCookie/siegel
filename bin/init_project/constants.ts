import { parse, relative, join } from 'path'

import { LOC_NAMES, PATHS } from '../../core/constants'
import { requireJSON, toPosixPath } from '../../core/utils'

import type { PackageJson } from './types'


const siegelPackageJson = requireJSON(PATHS.PACKAGE_JSON) as PackageJson
const {
    name: packageName,
    scripts: packageScripts,
    type: packageType,
    engines: packageEngines,
    config: packageConfig
} = siegelPackageJson
const siegelPackageJsonData = {
    packageName, packageScripts, packageType, packageEngines, packageConfig
}


const REPO_META = {
    user: 'cybercookie',
    repo: 'siegel'
}

const INIT_COMMON_LOC_NAMES = {
    DEMO_APP_SERVER_EXTENDER:   'app_server.ts',
    GIT_IGNORE_FILENAME:        '.gitignore',
    TS_GLOBALS_FILENAME:        parse(LOC_NAMES.TS_GLOBAL_TYPES).name
} as const


let SIEGEL_RELATIVE_PATH = relative(PATHS.CWD, PATHS.PACKAGE_ROOT)
SIEGEL_RELATIVE_PATH[0] != '.' && (SIEGEL_RELATIVE_PATH = `./${SIEGEL_RELATIVE_PATH}`)

const INIT_COMMON_PATHS = {
    SIEGEL_RELATIVE_PATH,
    SIEGEL_TS_GLOBALS_PATH:     toPosixPath(SIEGEL_RELATIVE_PATH),
    USER_TS_GlOBALS:            join(PATHS.CWD, LOC_NAMES.TS_GLOBAL_TYPES),
    USER_ESLINT:                join(PATHS.CWD, LOC_NAMES.ESLINT_CONFIG_JS),
    USER_PACKAGE_JSON:          join(PATHS.CWD, LOC_NAMES.PACKAGE_JSON),
    USER_GIT_IGNORE:            join(PATHS.CWD, INIT_COMMON_LOC_NAMES.GIT_IGNORE_FILENAME)
} as const


export {
    siegelPackageJsonData,
    INIT_COMMON_LOC_NAMES, INIT_COMMON_PATHS, REPO_META
}