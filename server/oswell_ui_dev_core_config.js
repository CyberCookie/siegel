const join = require('path').join;
const cwd = process.cwd()

const NODE_MODULES = join(cwd, 'node_modules')


const server = join(cwd, 'server', 'express_extender.js')
const output = join(cwd, 'dist')
const APP = join(cwd, 'client')

const assetsFolderName = 'assets'
const main = join(APP, 'main')



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


const oswellDevCoreConfig = {
    server: {
        extenderLoc: server,
        watch: true,
        
        host: process.env.NODE_HOST || 'localhost',
        port: process.env.NODE_PORT || 3000,

        // http2: true,
        // ssl: {
        //     keyPath: join(server, 'cert', 'localhost.key'),
        //     certPath: join(server, 'cert', 'localhost.crt')
        // }
    },


    build: {
        input: {
            include: APP,
            exclude: NODE_MODULES,
        
            js: join(APP, 'index.tsx'),
            sw: join(APP, 'sw.js'),
            html: join(APP, 'index.html'),
            assets: join(APP, assetsFolderName),

            sassResources: join(main, 'styles', 'sass_resources.sass')
        },
        
        output: {
            loc: output,
            assets: join(output, assetsFolderName)
        },
        
        aliases: getAliasesFromTSconfig(),

        // plugins: {
            // compression: {
            //     instances: {
            //         br: {
            //             options: { deleteOriginalAssets: false }
            //         },
            //         gzip: {
            //             options: { deleteOriginalAssets: false }
            //         }
            //     }
            // }
        // },

        // postProcessWebpackConfig(config) {
        //     config.module.rules.push({
        //         test: /\.woff2$/, // /\.(woff2|ico|png|jpg)$/
        //         include: APP,
        //         exclude: NODE_MODULES,
        //         loader: 'file-loader',
        //         options: { 
        //             name: assetsFolderName + '/[folder]/[name].[ext]'
        //         }
        //     })

        //     return config
        // }
    }
}


module.exports = oswellDevCoreConfig