const join = require('path').join;
const cwd = process.cwd()

const NODE_MODULES = join(cwd, 'node_modules')

const assetsFolderName = 'assets'
const APP = join(cwd, 'client')
const main = join(APP, 'main')
const assets = join(APP, assetsFolderName)

const output = join(cwd, 'dist')



function getAliasesFromTSconfig() {
    const TSAliases = require('./tsconfig').compilerOptions.paths;
    let aliases = {}

    for (let alias in TSAliases) {
        let WPAlias = alias.replace('/*', '')
        let WPPath = TSAliases[alias][0].replace('/*', '')

        aliases[WPAlias] = join(cwd, WPPath)
    }

    return aliases
}


const oswellDevCoreConfig = {
    server: {
        extenderLoc: join(cwd, 'server.js'),
        watch: true,
        
        host: process.env.NODE_HOST || 'localhost',
        port: process.env.NODE_PORT || 3000
    },


    build: {
        publicPath: '/',
        
        input: {
            include: APP,
            exclude: NODE_MODULES,
        
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
        
        aliases: getAliasesFromTSconfig(),

        extendPlugins(plugins) {
            return plugins
        },

        extendModuleRules(rules) {
            rules.push({
                // test: /\.(woff2|ico|png|jpg)$/,
                test: /\.woff2$/,
                include: APP,
                exclude: NODE_MODULES,
                loader: 'file-loader',
                options: { 
                    name: assetsFolderName + '/[folder]/[name].[ext]'
                }
            })


            return rules
        }
    }
}


module.exports = oswellDevCoreConfig