// TODO typing: export typeof merged configs


import path from 'path'
import fs from 'fs'

import { deepMerge, isExists } from 'siegel-utils'
import { PATHS, IS_SELF_DEVELOPMENT } from './constants'

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

    let config = {
        runMode: {
            isServer: true,
            isBuild: true,
            isProd: false
        },

        publicDir: PATHS.DEMO_PROJECT_OUTPUT,

        server: {
            host: 'localhost',
            port: 3000,
            serveCompressionsPriority: [ 'br', 'gzip' ]
        },

        build: {
            input: {
                html: path.join(PATHS.DEMO_PROJECT, 'client/index.html'),
                js: path.join(PATHS.CWD, 'app.ts')
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
        if (typeof userConfig === 'string') {
            config.build.input.js = userConfig

        } else {
            delete (config as ConfigObject).build!.output!.filenames

            config = deepMerge(config, userConfig, { skipUndef: true })
            const { isBuild, isProd, isServer } = config.runMode

            if (isServer) {
                const { appServer } = (config as ConfigObject).server!

                if (isExists(appServer) && !(appServer instanceof Function)) {
                    console.error('[config.server.appServer] ->> export value is not a function.')
                }
            }

            if (isBuild) {
                const { input, output } = config.build as BuildConfigsMerged

                output.filenames = Object.assign(
                    isProd ? prodFilenames : devFilenames,
                    output.filenames
                )

                if (fs.existsSync(input.js)) {
                    const userJSEntryDirName = path.dirname(input.js)

                    input.include
                        ?   input.include.push( userJSEntryDirName )
                        :   (input.include = [ userJSEntryDirName ])

                } else throw `config.build.input.js ->> [${input.js}] file doesn't exist.`
            }
        }
    }

    if (IS_SELF_DEVELOPMENT) {
        const { input } = config.build as BuildConfigsMerged
        input.include
            ?   input.include.push(PATHS.CLIENT_CORE, PATHS.SHARED_UTILS)
            :   (input.include = [ PATHS.CLIENT_CORE, PATHS.SHARED_UTILS ])
    }


    return config
}


export default getConfig