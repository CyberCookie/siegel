import path from 'path'
import fs from 'fs'
import { PATHS, IS_SELF_DEVELOPMENT } from './constants'

import deepMerge from '../common/deep/merge'
import isExists from '../common/is/exists'

import type { Filenames } from './client_build/types'
import type { ConfigObject, Config } from './types'


const getConfig = (userConfig?: Config) => {

    type BuildConfigsMerged = NonNullable<ConfigObject['build'] & (typeof config)['build']>


    const prodFilenames: Filenames = {
        assets: 'assets/[contenthash][ext]',
        js: '[contenthash].js',
        js_chunk: '[contenthash].js',
        styles: '[contenthash].css',
        styles_chunk: '[contenthash].css',
        brotli: '[base].br',
        gzip: '[base].gz'
    }
    const devFilenames: Filenames = {
        assets: 'assets/[name][ext]',
        js: 'app.[contenthash].js',
        js_chunk: 'chunk.[name][contenthash].js',
        styles: 'styles.[name].css',
        styles_chunk: 'chunk.[name].css',
        brotli: '[base].br',
        gzip: '[base].gz'
    }

    const config = {
        runMode: {
            isServer: true,
            isBuild: true,
            isProd: false
        },

        publicDir: PATHS.demoProjectOutput,

        server: {
            host: 'localhost',
            port: 3000,
            serveCompressionsPriority: [ 'br', 'gzip' ]
        },

        build: {
            input: {
                html: path.join(PATHS.demoProject, 'client/index.html'),
                js: path.join(PATHS.cwd, 'app.ts')
            },

            output: {
                publicPath: '/',
                target: 'es2022',
                filenames: devFilenames,
                logging: {
                    colors: true,
                    modules: false,
                    children: false
                }
            },

            aliases: {},

            plugins: {
                defaultPlugins: {
                    eslint: {
                        enabled: false
                    }
                }
            }
        }
    } satisfies ConfigObject


    if (userConfig) {
        if (typeof userConfig == 'string') {
            config.build.input.js = userConfig

        } else {
            Object.assign(config, deepMerge(config, userConfig, { skipUndef: true }))
            const { isBuild, isProd, isServer } = config.runMode

            if (isServer) {
                const { appServer } = userConfig.server!

                if (isExists(appServer) && !(appServer instanceof Function)) {
                    console.error('[config.server.appServer] ->> export type is not a function.')
                }
            }

            if (isBuild) {
                const { input, output } = config.build as BuildConfigsMerged

                if (isProd) {
                    output.filenames = Object.assign(prodFilenames, output.filenames)
                }

                if (fs.existsSync(input.js)) {
                    const userJSEntryDirName = path.dirname(input.js)

                    input.include
                        ?   input.include.push( userJSEntryDirName )
                        :   (input.include = [ userJSEntryDirName ])

                } else throw `config.build.input.js ->> [${input.js}] file doesn't exists.`
            }
        }
    }

    if (IS_SELF_DEVELOPMENT) {
        const { input } = config.build as BuildConfigsMerged
        input.include
            ?   input.include.push(PATHS.clientCore, PATHS.sharedUtils)
            :   (input.include = [ PATHS.clientCore, PATHS.sharedUtils ])
    }


    return config
}


export default getConfig