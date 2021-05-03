import type { RunParams } from './types'


const { join }              = require('path')
const { existsSync }        = require('fs')


function getParentNodemodules() {
    let result
    if (require.main) {
        const paths = require.main.paths
        for (let i = 0, l = paths.length; i < l; i++) {
            const nodePath = paths[i]
            if (existsSync(nodePath)) {
                result = nodePath
                break
            }
        }
    }


    return result
}


const cwd = process.cwd()
const root = join(__dirname, '..')

const globalNodeModules = require('child_process')
    .execSync('npm root -g')
    .toString()
    .trim()


//TODO?: src, server folders
const LOC_NAMES = {
    PACKAGE_JSON: 'package.json',
    ESLINT_JSON: '.eslintrc',
    TS_JSON: 'tsconfig.json',
    TS_ESLINT_JSON: 'tsconfig.eslint.json',
    NODE_MODULES: 'node_modules'
} as const

const PATHS = {
    cwd, root, globalNodeModules,
    demoProject: join(root, 'demo_app'),
    clientCore: join(root, 'client_core'),
    nodeModules: join(root, LOC_NAMES.NODE_MODULES),
    parentNodeModules: getParentNodemodules() || globalNodeModules,
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
            include: [ PATHS.clientCore ],
            exclude: [ PATHS.nodeModules/*, PATHS.parentNodeModules*/ ]
        },

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