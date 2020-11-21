const join = require('path').join;
const rootPath = join(__dirname, '..')


const APP = join(rootPath, 'client')
const server = join(rootPath, 'server', 'app_server.js')

const main = join(APP, 'main')



function getAliasesFromTSconfig() {
    const TSAliases = require('../tsconfig').compilerOptions.paths;
    const aliases = {}

    for (const alias in TSAliases) {
        const WPAlias = alias.replace('/*', '')
        const WPPath = TSAliases[alias][0].replace('/*', '')

        aliases[WPAlias] = join(rootPath, WPPath)
    }

    return aliases
}

// const { loadersKeyMap, webpackModulesRegExp } = require('../../src/ui_build/constants')
const siegelConfig = {
    server: {
        appServerLoc: server,
        watch: true,
        
        host: process.env.NODE_HOST,
        port: process.env.NODE_PORT,
    },


    build: {
        input: {
            js: join(APP, 'index.tsx'),
            sw: join(APP, 'sw.js'),
            html: join(APP, 'index.html'),
            assetsDir: join(APP, 'assets'),

            sassResources: join(main, 'styles', 'sass_resources.sass')
        },
        
        aliases: getAliasesFromTSconfig()

        // ,modules: {
        //     [webpackModulesRegExp.styles]: {
        //         loaders: {
        //             [loadersKeyMap.postCssLoader]: {
        //                 options(defaultOptions) {
        //                     defaultOptions.postcssOptions.plugins[1][1].fontNamePrefix = 'ololo'
        //                     return defaultOptions
        //                 }
        //             }
        //         }
        //     }
        // }
    }
}


module.exports = siegelConfig