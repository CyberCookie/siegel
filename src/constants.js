const join              = require('path').join;
const { existsSync }    = require('fs')


function getParentNodemodules() {
    const paths = require.main.paths;
    for (let i = 0, l = paths.length; i < l; i++) {
        const nodePath = paths[i]
        if (existsSync(nodePath)) return nodePath
    }
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


const DEFAULT_CONFIG = {
    server: {
        host: 'localhost',
        port: 3000
    },

    build: {
        input: {
            html: join(PATHS.demoProject, 'client', 'index.html'),
            js: join(cwd, 'app.ts'),
            include: [ PATHS.uiCore ],
            exclude: [ PATHS.nodeModules, PATHS.parentNodeModules ]
        },

        output: join(cwd, 'dist')
    }
}


const DEFAULT_RUN_PARAMS = {
    isServer: true,
    isBuild: true,
    isProd: false
}


module.exports = { PATHS, DEFAULT_RUN_PARAMS, DEFAULT_CONFIG }