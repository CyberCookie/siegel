const join = require('path').join;
const cwd = process.cwd()

const NODE_MODULES = join(cwd, 'node_modules')


const server = join(cwd, 'server', 'express_extender.js')
const output = join(cwd, 'dist')
const APP = join(cwd, 'client')

const main = join(APP, 'main')



function getAliasesFromTSconfig() {
    const TSAliases = require('../tsconfig').compilerOptions.paths;
    const aliases = {}

    for (const alias in TSAliases) {
        const WPAlias = alias.replace('/*', '')
        const WPPath = TSAliases[alias][0].replace('/*', '')

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
            assetsDir: join(APP, 'assets'),

            sassResources: join(main, 'styles', 'sass_resources.sass')
        },
        
        output,
        
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