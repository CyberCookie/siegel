const { join, basename }    = require('path')
const { existsSync }        = require('fs')


function getParentNodemodules() {
    let result;

    const paths = require.main.paths;
    for (let i = 0, l = paths.length; i < l; i++) {
        const nodePath = paths[i]
        if (existsSync(nodePath)) {
            result = nodePath;
            break
        }
    }

    if (!result) {
        result = require('child_process')
            .execSync('npm root -g')
            .toString()
    }


    return result
}


const cwd = process.cwd()
const root = join(__dirname, '..')

const PATHS = {
    root,
    demoProject: join(root, 'demo_app'),
    nodeModules: join(root, 'node_modules'),
    parentNodeModules: getParentNodemodules(),
    package: join(root, 'package.json'),
    build: join(__dirname, 'ui_build', 'index'),
    staticServer: join(__dirname, 'server', 'index'),
    uiCore: join(__dirname, 'ui_core')
}
PATHS.cwdPackageJSON = join(cwd, basename(PATHS.package))


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
            include: [ PATHS.uiCore ],
            exclude: [ PATHS.nodeModules/*, PATHS.parentNodeModules*/ ]
        }
    }
}


const DEFAULT_RUN_PARAMS = {
    isServer: true,
    isBuild: true,
    isProd: false
}


module.exports = { PATHS, DEFAULT_RUN_PARAMS, DEFAULT_CONFIG }