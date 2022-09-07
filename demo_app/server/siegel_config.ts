import { join } from 'path'
import { nodeUtils, Config } from '../../core'

import appServer from './app_server.js'


const { tsToWebpackAliases, cjs__dirname } = nodeUtils

const __dirname = cjs__dirname(import.meta)
const rootPath = join(__dirname, '..')

const CLIENT_APP = join(rootPath, 'client')
const CLIENT_MAIN = join(CLIENT_APP, 'main')


const siegelConfig: Config = {
    server: { appServer },

    build: {
        input: {
            js: join(CLIENT_APP, 'index.ts'),
            sw: join(CLIENT_APP, 'sw.js'),
            html: join(CLIENT_APP, 'index.html'),
            copyFiles: join(CLIENT_APP, 'assets', 'copy'),
            sassResources: join(CLIENT_MAIN, 'styles', 'sass_resources.sass'),
            iconsRoot: join(CLIENT_MAIN, 'components', 'icons', 'svg_sources')
        },

        eslint: true,

        aliases: tsToWebpackAliases(rootPath)
    }
}


export default siegelConfig