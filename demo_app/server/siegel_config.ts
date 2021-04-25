const join = require('path').join
const rootPath = join(__dirname, '..')



const APP = join(rootPath, 'client')

function getAliasesFromTSconfig() {
    const TSAliases = require('../tsconfig').compilerOptions.paths
    const aliases: any = {}

    for (const alias in TSAliases) {
        const WPAlias = alias.replace('/*', '')
        const WPPath = TSAliases[alias][0].replace('/*', '')

        aliases[WPAlias] = join(rootPath, WPPath)
    }

    return aliases
}


const siegelConfig = {
    server: {
        appServerLoc: join(rootPath, 'server', 'app_server.ts'),
        watch: true,

        host: process.env.NODE_HOST,
        port: process.env.NODE_PORT,
    },


    build: {
        input: {
            js: join(APP, 'index.ts'),
            sw: join(APP, 'sw.js'),
            html: join(APP, 'index.html'),
            assetsDir: join(APP, 'assets'),

            sassResources: join(APP, 'main', 'styles', 'sass_resources.sass')
        },

        aliases: getAliasesFromTSconfig()
    }
}


module.exports = siegelConfig