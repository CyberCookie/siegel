import type { RunParams } from './types'


const { join } = require('path')

const { INIT_CWD, PWD } = process.env
console.log('DEBUG: INIT_CWD: ', INIT_CWD)
console.log('DEBUG: PWD:      ', PWD)
console.log('DEBUG: CWD:      ', process.cwd())
if (INIT_CWD && INIT_CWD != PWD) {
    process.chdir(INIT_CWD)
}
console.log('DEBUG: NEW PWD: ', process.env.PWD)
console.log('DEBUG: NEW CWD: ', process.cwd())


const cwd = process.cwd()
const root = join(__dirname, '..')


//TODO?: src, server folders
const LOC_NAMES = {
    PACKAGE_JSON: 'package.json',
    ESLINT_JSON: '.eslintrc',
    TS_JSON: 'tsconfig.json',
    TS_ESLINT_JSON: 'tsconfig.eslint.json',
    NODE_MODULES: 'node_modules'
} as const

const PATHS = {
    cwd, root,
    demoProject: join(root, 'demo_app'),
    clientCore: join(root, 'client_core'),
    package: join(root, LOC_NAMES.PACKAGE_JSON),
    cwdPackageJSON: join(cwd, LOC_NAMES.PACKAGE_JSON),
    build: join(__dirname, 'client_build', 'index'),
    staticServer: join(__dirname, 'server', 'index'),
} as const


const DEFAULT_CONFIG = {
    staticDir: join(cwd, 'dist'),

    server: {
        host: 'localhost',
        port: 3000
    },

    build: {
        input: {
            html: join(PATHS.demoProject, 'client', 'index.html'),
            js: join(cwd, 'app.ts'),
            include: [ PATHS.clientCore ]
        },

        eslint: false,

        publicPath: '/',
        aliases: {}
    }
} as const


const DEFAULT_RUN_PARAMS: RunParams = {
    isServer: true,
    isBuild: true,
    isProd: false
} as const


module.exports = { PATHS, LOC_NAMES, DEFAULT_RUN_PARAMS, DEFAULT_CONFIG }
export {}