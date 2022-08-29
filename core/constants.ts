import { join, sep } from 'path'

import cjs__dirname from './utils/cjs__dirname.js'

import type { RunParamsFinal, ConfigDefault } from './types'


const { INIT_CWD, PWD } = process.env
if (INIT_CWD && INIT_CWD != PWD) {
    process.chdir(INIT_CWD)
}




const LOC_NAMES = {
    PACKAGE_JSON: 'package.json',
    NODE_MODULES: 'node_modules',

    ESLINT_JSON: '.eslintrc',
    TS_ESLINT_JSON: 'tsconfig.eslint.json',
    TS_JSON: 'tsconfig.json',
    TS_GLOBAL_TYPES: 'global.d.ts',

    CLIENT_CORE_DIR_NAME: 'client_core',
    SRC_DIR_NAME: 'core',
    UTILS_DIR_NAME: 'common',
    BIN_DIR_NAME: 'bin',
    LIB_OUTPUT_DIRNAME: 'lib',

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

    demoProject:        join(packageRoot, LOC_NAMES.DEMO_APP_DIR_NAME),
    demoProjectOutput:  join(cwd, LOC_NAMES.DEMO_APP_OUTPUT_DIR_NAME)
}




const _isSelfDevelopment = cwd == packageRoot


const DEFAULT_CONFIG: ConfigDefault = {
    publicDir: PATHS.demoProjectOutput,

    server: {
        host: 'localhost',
        port: 3000,
        serveCompressionsPriority: [ 'br', 'gzip' ]
    },

    build: {
        input: {
            html: join(PATHS.demoProject, 'client/index.html'),
            js: join(cwd, 'app.ts'),

            ...( _isSelfDevelopment ? {
                include: [ PATHS.clientCore, PATHS.sharedUtils ]
            }: {})
        },

        output: {
            publicPath: '/',
            target: 'es2020',
            filenames: {
                PROD: {
                    assets: 'assets/[contenthash][ext]',
                    js: '[contenthash].js',
                    js_chunk: '[contenthash].js',
                    styles: '[contenthash].css',
                    styles_chunk: '[contenthash].css',
                    brotli: '[base].br',
                    gzip: '[base].gz'
                },
                DEV: {
                    assets: 'assets/[name][ext]',
                    js: 'app.[contenthash].js',
                    js_chunk: 'chunk.[name][contenthash].js',
                    styles: 'styles.[name].css',
                    styles_chunk: 'chunk.[name].css'
                }
            }
        },

        eslint: false,

        aliases: {}
    }
} as const



const DEFAULT_RUN_PARAMS: RunParamsFinal = {
    isServer: true,
    isBuild: true,
    isProd: false,

    _isDevServer: true,
    _isSelfDevelopment
} as const


export { PATHS, LOC_NAMES, DEFAULT_RUN_PARAMS, DEFAULT_CONFIG }