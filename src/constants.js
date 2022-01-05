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
    SRC_OUTPUT: 'cjs',
    SRC_DIR_NAME: 'src'
}
const PATHS = {
    cwd, root, globalNodeModules,
    cwdNodeModules: join(cwd, LOC_NAMES.NODE_MODULES),
    cwdPackageJSON: join(cwd, LOC_NAMES.PACKAGE_JSON),
    demoProject: join(root, 'demo_app'),
    clientCore: join(root, LOC_NAMES.CLIENT_CORE_DIR_NAME),
    clientCoreOutput: join(root, LOC_NAMES.CLIENT_CORE_OUTPUT_DIR_NAME),
    build: join(__dirname, 'client_build'),
    staticServer: join(__dirname, 'server'),
    srcOutput: join(root, LOC_NAMES.SRC_OUTPUT),
    package: join(root, LOC_NAMES.PACKAGE_JSON),
    nodeModules: join(root, LOC_NAMES.NODE_MODULES)
}

const _PATHS = {
    cwd,
    root: {
        src: {
            static_server: 'server',
            client_build: 'client_build'
        },
        src_output: 'cjs'
    }
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
    isProd: false
}


module.exports = { PATHS, LOC_NAMES, DEFAULT_RUN_PARAMS, DEFAULT_CONFIG }