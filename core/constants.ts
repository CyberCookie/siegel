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

    DEMO_MINI_APP_DIR_NAME: 'demo_app_minimal',
    DEMO_APP_DIR_NAME: 'demo_app',
    DEMO_APP_OUTPUT_DIR_NAME: 'dist'
} as const



const __dirname = cjs__dirname(import.meta)
const cwd = process.cwd()

let packageRoot = join(__dirname, '..')
if (packageRoot.endsWith(`${sep}${LOC_NAMES.LIB_OUTPUT_DIRNAME}`)) {
    packageRoot = join(packageRoot, '..')
}


const libOutput = join(packageRoot, LOC_NAMES.LIB_OUTPUT_DIRNAME)
const PATHS = {
    cwd, packageRoot,
    cwdNodeModules:     join(cwd, LOC_NAMES.NODE_MODULES),
    packageJSON:        join(packageRoot, LOC_NAMES.PACKAGE_JSON),
    nodeModules:        join(packageRoot, LOC_NAMES.NODE_MODULES),

    sharedUtils:        join(packageRoot, LOC_NAMES.UTILS_DIR_NAME),
    sharedUtilsOutput:  join(libOutput, LOC_NAMES.UTILS_DIR_NAME),
    clientCore:         join(packageRoot, LOC_NAMES.CLIENT_CORE_DIR_NAME),
    clientCoreOutput:   join(libOutput, LOC_NAMES.CLIENT_CORE_DIR_NAME),
    src:                join(packageRoot, LOC_NAMES.SRC_DIR_NAME),
    srcOutput:          join(libOutput, LOC_NAMES.SRC_DIR_NAME),
    binOutput:          join(libOutput, LOC_NAMES.BIN_DIR_NAME),

    demoMiniProject:    join(packageRoot, LOC_NAMES.DEMO_MINI_APP_DIR_NAME),
    demoProject:        join(packageRoot, LOC_NAMES.DEMO_APP_DIR_NAME),
    demoProjectOutput:  join(cwd, LOC_NAMES.DEMO_APP_OUTPUT_DIR_NAME)
}


const IS_SELF_DEVELOPMENT = cwd == packageRoot


export { PATHS, LOC_NAMES, IS_SELF_DEVELOPMENT }