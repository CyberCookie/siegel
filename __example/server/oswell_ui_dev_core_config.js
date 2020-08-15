const join = require('path').join;
const rootPath = join(__dirname, '..')


const APP = join(rootPath, 'client')
const server = join(rootPath, 'server', 'app_server.js')
const output = join(rootPath, 'dist')

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


const oswellDevCoreConfig = {
    server: {
        extenderLoc: server,
        watch: true,
        
        host: process.env.NODE_HOST,
        port: process.env.NODE_PORT,

        // http2: true,
        // ssl: {
        //     keyPath: join(server, 'cert', 'localhost.key'),
        //     certPath: join(server, 'cert', 'localhost.crt')
        // }
    },


    build: {
        input: {
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

        //     config.module.rules.push({
        //         test: /\.(svg|eot|ttf|woff|woff2)?$/,
        //         loader: "url-loader"
        //     })


        //     return config
        // }
    }
}


module.exports = oswellDevCoreConfig