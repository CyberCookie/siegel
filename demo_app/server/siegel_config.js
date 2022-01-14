import { join } from 'path'
import { readFileSync } from 'fs'

import cjs__dirname from '../../src/utils/__dirname.js'


const __dirname = cjs__dirname(import.meta)
const rootPath = join(__dirname, '..')
const APP = `${rootPath}/client`


const siegelConfig = {
    server: {
        appServerLoc: join(rootPath, 'server', 'app_server.js'),
        watch: true,
        host: process.env.NODE_HOST,
        port: process.env.NODE_PORT
    },


    build: {
        input: {
            js: join(APP, 'index.ts'),
            sw: join(APP, 'sw.js'),
            html: join(APP, 'index.html'),
            copyFiles: join(APP, 'assets', 'copy'),
            sassResources: join(APP, 'main', 'styles', 'sass_resources.sass')
        },

        eslint: true,

        aliases: (() => {
            const tsConfig = JSON.parse(
                readFileSync(`${APP}/tsconfig.json`, 'utf8')
            )
            const TSAliases = tsConfig.compilerOptions.paths

            const aliases = {}
            for (const alias in TSAliases) {
                const WPAlias = alias.replace('/*', '')
                const WPPath = TSAliases[alias][0].replace('/*', '')

                aliases[WPAlias] = join(APP, WPPath)
            }


            return aliases
        })()
    }
}


export default siegelConfig