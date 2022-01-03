const { INIT_CWD, PWD } = process.env
if (INIT_CWD && INIT_CWD != PWD) {
    process.chdir(INIT_CWD)
}


const { join } = require('path')


const cwd = process.cwd()
const root = join(__dirname, '..')
const globalNodeModules = require('child_process')
    .execSync('npm root -g')
    .toString()
    .trim()


//TODO: refactor
const LOC_NAMES = {
    PACKAGE_JSON: 'package.json',
    ESLINT_JSON: '.eslintrc',
    TS_JSON: 'tsconfig.json',
    TS_GLOBAL_TYPES: 'global.d.ts',
    TS_ESLINT_JSON: 'tsconfig.eslint.json',
    NODE_MODULES: 'node_modules',
    CLIENT_CORE_DIR_NAME: 'client_core',
    CLIENT_CORE_OUTPUT_DIR_NAME: 'lib_client',
    SRC_DIR_NAME: 'src'
}
const PATHS = {
    cwd, root, globalNodeModules,
    demoProject: join(root, 'demo_app'),
    clientCore: join(root, LOC_NAMES.CLIENT_CORE_DIR_NAME),
    package: join(root, LOC_NAMES.PACKAGE_JSON),
    nodeModules: join(root, LOC_NAMES.NODE_MODULES),
    cwdPackageJSON: join(cwd, LOC_NAMES.PACKAGE_JSON),
    build: join(__dirname, 'client_build', 'index'),
    staticServer: join(__dirname, 'server', 'index')
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
            include: cwd == root
                ?   [ PATHS.clientCore ]
                :   undefined
        },

        target: 'es2020',

        eslint: false,

        publicPath: '/',
        aliases: {}
    }
}



const DEFAULT_RUN_PARAMS = {
    isServer: true,
    isBuild: true,
    isProd: false
}


module.exports = { PATHS, LOC_NAMES, DEFAULT_RUN_PARAMS, DEFAULT_CONFIG }