import { join } from 'path'

import { nodeUtils, Config } from '../../core'


const { requireJSON, cjs__dirname } = nodeUtils

const __dirname = cjs__dirname(import.meta)
const rootPath = join(__dirname, '..')
const APP = `${rootPath}/client`


const siegelConfig: Config = {
    server: {
        appServerLoc: join(rootPath, 'server', 'app_server.js')
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
            const tsConfig = requireJSON(`${rootPath}/tsconfig.json`)
            const TSAliases = tsConfig.compilerOptions.paths

            const aliases: Indexable = {}
            for (const alias in TSAliases) {
                const WPAlias = alias.replace('/*', '')
                const WPPath = TSAliases[alias][0].replace('/*', '')

                aliases[WPAlias] = join(rootPath, WPPath)
            }


            return aliases
        })()
    }
}


export default siegelConfig