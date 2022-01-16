import path from 'path'

import cjs__dirname from './utils/__dirname.js'


const { INIT_CWD, PWD } = process.env
if (INIT_CWD && INIT_CWD != PWD) {
    process.chdir(INIT_CWD)
}


const __dirname = cjs__dirname(import.meta)
const cwd = process.cwd()
const root = path.join(__dirname, '..')
const _isSelfDevelopment = cwd == root

//TODO?: refactor
const LOC_NAMES = {
    PACKAGE_JSON: 'package.json',
    ESLINT_JSON: '.eslintrc',
    TS_JSON: 'tsconfig.json',
    TS_GLOBAL_TYPES: 'global.d.ts',
    TS_ESLINT_JSON: 'tsconfig.eslint.json',
    NODE_MODULES: 'node_modules',
    CLIENT_CORE_DIR_NAME: 'client_core',
    CLIENT_CORE_OUTPUT_DIR_NAME: 'lib_client',
    SRC_OUTPUT: 'cjs',
    SRC_DIR_NAME: 'src'
}
const PATHS = {
    cwd, root,
    cwdNodeModules:     `${cwd}/${LOC_NAMES.NODE_MODULES}`,
    nodeModules:        `${root}/${LOC_NAMES.NODE_MODULES}`,
    clientCore:         `${root}/${LOC_NAMES.CLIENT_CORE_DIR_NAME}`,
    clientCoreOutput:   `${root}/${LOC_NAMES.CLIENT_CORE_OUTPUT_DIR_NAME}`,
    srcOutput:          `${root}/${LOC_NAMES.SRC_OUTPUT}`,
    demoProject:        `${root}/demo_app`,
    build:              `${__dirname}/client_build/index.js`,
    staticServer:       `${__dirname}/server/index.js`
}


const DEFAULT_CONFIG = {
    staticDir: `${cwd}/dist`,

    server: {
        host: 'localhost',
        port: 3000
    },

    build: {
        input: {
            html: `${PATHS.demoProject}/client/index.html`,
            js: `${cwd}/app.ts`,

            ...( _isSelfDevelopment ? {
                include: [ PATHS.clientCore ]
            }: {})
        },

        output: {
            publicPath: '/',
            target: 'es2020',
            filenames: {
                PROD: {
                    assets: 'assets/[contenthash].[ext]',
                    js: '[contenthash].js',
                    js_chunk: '[contenthash].js',
                    styles: '[contenthash].css',
                    styles_chunk: '[contenthash].css',
                    brotli: '[name].br',
                    gzip: '[name].gz'
                },
                DEV: {
                    assets: 'assets/[name].[ext]',
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
}


const DEFAULT_RUN_PARAMS = {
    isServer: true,
    isBuild: true,
    isProd: false,

    _isSelfDevelopment
}


export { PATHS, LOC_NAMES, DEFAULT_RUN_PARAMS, DEFAULT_CONFIG }