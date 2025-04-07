import path from 'path'
import fs from 'fs'
import { PATHS, IS_SELF_DEVELOPMENT } from './constants'

import isExists from '../common/is/exists'

import type { Filenames } from './client_build/types'
import type { ConfigObject, Config } from './types'


function mergeConfigs(defaultConfig: Obj, userConfig: Obj) {
    Object.entries(defaultConfig)
        .forEach(([ defaultConfigKey, defaultConfigValue ]) => {
            const userValue = userConfig[defaultConfigKey]

            if (typeof defaultConfigValue == 'object' && typeof userValue == 'object') {
                mergeConfigs(defaultConfigValue, userValue)

            } else if (isExists(userValue)) {
                defaultConfig[defaultConfigKey] = userValue
            }
        })


    Object.entries(userConfig)
        .forEach(([ userConfigKey, userConfigValue ]) => {
            if (!Object.prototype.hasOwnProperty.call(defaultConfig, userConfigKey)) {
                defaultConfig[userConfigKey] = userConfigValue
            }
        })
}


const getConfig = (userConfig?: Config) => {

    type BuildConfigsMerged = NonNullable<ConfigObject['build'] & (typeof result)['build']>


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

    const result = {
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

            eslint: false,

            aliases: {}
        }
    } satisfies ConfigObject




    if (userConfig) {
        if (typeof userConfig == 'string') {
            result.build.input.js = userConfig

        } else {
            Object.assign(result.runMode, userConfig.runMode)
            const { isBuild, isProd, isServer } = result.runMode


            if (userConfig.publicDir) {
                result.publicDir = userConfig.publicDir
            }
            userConfig.server && mergeConfigs(result.server, userConfig.server)
            userConfig.build && mergeConfigs(result.build, userConfig.build)


            if (isServer) {
                const { appServer } = userConfig.server!

                if (isExists(appServer) && !(appServer instanceof Function)) {
                    console.error('[config.server.appServer] ->> export type is not a function.')
                }
            }

            if (isBuild) {
                const { input, output } = result.build as BuildConfigsMerged

                if (isProd) {
                    output.filenames = prodFilenames
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
        const { input } = result.build as BuildConfigsMerged
        input.include
            ?   input.include.push(PATHS.clientCore, PATHS.sharedUtils)
            :   (input.include = [ PATHS.clientCore, PATHS.sharedUtils ])
    }


    return result
}


export default getConfig