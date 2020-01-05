const join = require('path').join;
const cwd = process.cwd()


const output = join(cwd, 'dist')
const src = join(cwd, 'src')

const APP = join(src, 'demo_app')
const main = join(APP, 'main')

const assetsFolderName = 'assets'
const assets = join(APP, assetsFolderName)


function getAliasesFromTSconfig() {
    const TSAliases = require('../tsconfig').compilerOptions.paths;
    let aliases = {}

    for (let alias in TSAliases) {
        let WPAlias = alias.replace('/*', '')
        let WPPath = TSAliases[alias][0].replace('/*', '')

        aliases[WPAlias] = join(cwd, WPPath)
    }

    return aliases
}


const config = {
    server: {
        customServerLoc: join(cwd, 'demo_rest_serv.js'),
        watch: true,

        nodeHost: process.env.NODE_HOST || 'localhost',
        nodePort: process.env.NODE_PORT || 3000
    },

    
    build: {
        publicPath: '/',

        input: {
            include: src,
            exclude: join(cwd, 'node_modules'),
            main,

            js: join(APP, 'index.ts'),
            html: join(APP, 'index.html'),
            sassResources: join(main, 'styles', 'sass_resources.sass'),
            assets: {
                loc: assets,
                assetsFolderName,
                images: join(assets, 'images'),
                pwa: join(assets, 'pwa'),
                sw: join(assets, 'sw.js')
            }
        },

        output: {
            loc: output,
            assets: join(output, assetsFolderName)
        },

        aliases: getAliasesFromTSconfig()
    }
}


module.exports = config