import { join, sep } from 'path'

import cjs__dirname from './utils/cjs__dirname.js'


const LOC_NAMES = {
    PACKAGE_JSON: 'package.json',
    NODE_MODULES: 'node_modules',

    ESLINT_CONFIG_JS: 'eslint.config.js',
    TS_JSON: 'tsconfig.json',
    TS_GLOBAL_TYPES: 'global.d.ts',

    CLIENT_CORE_DIR_NAME: 'client_core',
    SRC_DIR_NAME: 'core',
    UTILS_DIR_NAME: 'common',
    BIN_DIR_NAME: 'bin',
    LIB_OUTPUT_DIRNAME: 'lib',

    DEMO_APP_MINI_DIR_NAME: 'demo_app_minimal',
    DEMO_APP_DIR_NAME: 'demo_app',
    DEMO_APP_OUTPUT_DIR_NAME: 'dist'
} as const



const __dirname = cjs__dirname(import.meta)
const CWD = process.cwd()

let PACKAGE_ROOT = join(__dirname, '..')
if (PACKAGE_ROOT.endsWith(`${sep}${LOC_NAMES.LIB_OUTPUT_DIRNAME}`)) {
    PACKAGE_ROOT = join(PACKAGE_ROOT, '..')
}


const LIB_OUTPUT = join(PACKAGE_ROOT, LOC_NAMES.LIB_OUTPUT_DIRNAME)
const PATHS = {
    CWD,
    PACKAGE_ROOT,
    PACKAGE_JSON:           join(PACKAGE_ROOT, LOC_NAMES.PACKAGE_JSON),
    NODE_MODULES:           join(PACKAGE_ROOT, LOC_NAMES.NODE_MODULES),
    USER_NODE_MODULES:      join(CWD, LOC_NAMES.NODE_MODULES),

    SHARED_UTILS:           join(PACKAGE_ROOT, LOC_NAMES.UTILS_DIR_NAME),
    SHARED_UTILS_OUTPUT:    join(LIB_OUTPUT, LOC_NAMES.UTILS_DIR_NAME),
    CLIENT_CORE:            join(PACKAGE_ROOT, LOC_NAMES.CLIENT_CORE_DIR_NAME),
    CLIENT_CORE_OUTPUT:     join(LIB_OUTPUT, LOC_NAMES.CLIENT_CORE_DIR_NAME),
    SRC:                    join(PACKAGE_ROOT, LOC_NAMES.SRC_DIR_NAME),
    SRC_OUTPUT:             join(LIB_OUTPUT, LOC_NAMES.SRC_DIR_NAME),
    BIN_OUTPUT:             join(LIB_OUTPUT, LOC_NAMES.BIN_DIR_NAME),

    DEMO_MINI_PROJECT:      join(PACKAGE_ROOT, LOC_NAMES.DEMO_APP_MINI_DIR_NAME),
    DEMO_PROJECT:           join(PACKAGE_ROOT, LOC_NAMES.DEMO_APP_DIR_NAME),
    DEMO_PROJECT_OUTPUT:    join(CWD, LOC_NAMES.DEMO_APP_OUTPUT_DIR_NAME)
}


const IS_SELF_DEVELOPMENT = CWD == LIB_OUTPUT


export { PATHS, LOC_NAMES, IS_SELF_DEVELOPMENT }