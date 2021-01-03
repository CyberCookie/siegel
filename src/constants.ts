import type { RunParams } from './types'

const { join, basename }    = require('path')
const { existsSync }        = require('fs')


function getParentNodemodules() {
    let result;
    if (require.main) {
        const paths = require.main.paths;
        for (let i = 0, l = paths.length; i < l; i++) {
            const nodePath = paths[i]
            if (existsSync(nodePath)) {
                result = nodePath;
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

const packageJSONFile = join(root, 'package.json')
    
const PATHS = {
    root, globalNodeModules,
    demoProject: join(root, 'demo_app'),
    clientCore: join(root, 'client_core'),
    nodeModules: join(root, 'node_modules'),
    cjs: join(root, 'cjs'),
    parentNodeModules: getParentNodemodules() || globalNodeModules,
    package: packageJSONFile,
    cwdPackageJSON: join(cwd, basename(packageJSONFile)),
    build: join(__dirname, 'client_build', 'index'),
    staticServer: join(__dirname, 'server', 'index'),
}


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
}


const DEFAULT_RUN_PARAMS: RunParams = {
    isServer: true,
    isBuild: true,
    isProd: false
}


module.exports = { PATHS, DEFAULT_RUN_PARAMS, DEFAULT_CONFIG }
export {}