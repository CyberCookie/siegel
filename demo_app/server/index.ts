import { join } from 'path'
import siegel, { nodeUtils } from '../../core'

import appServer from './app_server.js'


const { tsToWebpackAliases, cjs__dirname } = nodeUtils


const RUN_ARGUMENTS = new Set(process.argv)

const isServer = RUN_ARGUMENTS.has('-s')
const isBuild = RUN_ARGUMENTS.has('-b')
const isProd = RUN_ARGUMENTS.has('-p')

isProd && (process.env.NODE_ENV = 'production')


const __dirname = cjs__dirname(import.meta)
const rootPath = join(__dirname, '..')

const CLIENT_APP = join(rootPath, 'client')
const CLIENT_MAIN = join(CLIENT_APP, 'main')



siegel({
    runMode: { isProd, isServer, isBuild },

    server: { appServer },

    build: {
        input: {
            js: join(CLIENT_APP, 'index.ts'),
            sw: join(CLIENT_APP, 'sw.ts'),
            html: join(CLIENT_APP, 'index.html'),
            copyFiles: join(CLIENT_APP, 'assets', 'copy'),
            sassResources: join(CLIENT_MAIN, 'styles', 'sass_resources.sass'),
            iconsRoot: join(CLIENT_MAIN, 'components', 'icons', 'svg_sources')
        },

        aliases: tsToWebpackAliases(rootPath)
    }
})