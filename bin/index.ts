#!/usr/bin/env node

//TODO?: console output: checkboxes, progress, timings

import path from 'path'

import { LOC_NAMES, PATHS } from '../core/constants.js'
import getConfig from '../core/get_config.js'
import siegel, { nodeUtils, utils } from '../core'
import initProject from './init_project.js'
import initMiniProject from './init_minimal.js'
import createSSLCerts from './create_SSL.js'

import type { ServerConfig } from '../core/server/types'
import type { BuildConfig } from '../core/client_build/types'
import type {
    Command, CommanTree, CommandsWithParams,
    PrintHelpFlagsMap, CommandExampleFn, ALlCommands
} from './types'


const { globalNodeModulesPath, requireJSON, parseCommandLineArgs } = nodeUtils

const getColored = (color: number, str: string) => `\x1b[${color}m${str}\x1b[0m`
const getColoredCommandStr = getColored.bind(null, 36)
const getColoredCommandArgumentStr = getColored.bind(null, 32)
const getColoredHighlightText = getColored.bind(null, 33)

const resolvePath = (_path: string) => path.isAbsolute(_path) ? _path : `${PATHS.cwd}/${_path}`


const DEFAULT_CONFIG = getConfig()


const COMMANDS_TREE: CommanTree = {
    run: {
        description: 'Builds client and runs dev server with client watch mode enabled.',
        example: (command, { client, server, port }) => (
            `siegel ${command} ${client!.flagLong} app.ts ${server!.flagLong} server.ts ${port!.flagLong} 4000`
        ),
        prepareResult: () => ({
            config: DEFAULT_CONFIG
        }),
        commandAction({ result }) {
            siegel(result.config)
        },
        params: [
            {
                flagLong: '--production',
                flag: '-p',
                description: 'Production mode.',
                defaultValue: false,
                paramAction({ result }) {
                    result.config.runMode!.isProd = true
                }
            },
            {
                flagLong: '--build-only',
                flag: '-b',
                description: 'Builds client with no static server enabled.',
                defaultValue: false,
                paramAction({ result }) {
                    result.config.runMode!.isServer = false
                }
            },
            {
                flagLong: '--serv-only',
                flag: '-s',
                description: 'Serves built client.',
                defaultValue: false,
                paramAction({ result }) {
                    result.config.runMode!.isBuild = false
                }
            },
            {
                flagLong: '--config',
                description: 'Path to Siegel config.',
                async paramAction({ value, result }) {
                    const resolvedPath = resolvePath(value as string)

                    const config = (value as string).endsWith('.json')
                        ?   requireJSON(resolvedPath)
                        :   (await import(resolvedPath)).default

                    result.config = getConfig(config)
                }
            },
            {
                flagLong: '--eslint',
                flag: '-l',
                description: 'Enables lintng with ESLint.',
                defaultValue: DEFAULT_CONFIG.build.eslint,
                paramAction({ result }) {
                    result.config.build!.eslint = true
                }
            },
            {
                flagLong: '--resolve-globals',
                flag: '-g',
                description: 'Enable resolve global node modules imports.',
                defaultValue: false,
                paramAction({ result }) {
                    (result.config.build as BuildConfig).postProcessWebpackConfig = webpackConfig => {
                        webpackConfig.resolve!.modules!.push(
                            globalNodeModulesPath()
                        )

                        return webpackConfig
                    }
                }
            },
            {
                flagLong: '--client',
                flag: '-C',
                description: 'Path to client app entrypoint.',
                defaultValue: DEFAULT_CONFIG.build.input.js,
                paramAction({ value, result }) {
                    result.config.build!.input!.js = resolvePath(value as string)
                }
            },
            {
                flagLong: '--server',
                flag: '-S',
                description: 'Path to server app entrypoint.',
                async paramAction({ value, result }) {
                    const appServer = await import(resolvePath(value as string))
                    ;(result.config.server as ServerConfig).appServer = appServer.default
                }
            },
            {
                flagLong: '--port',
                description: 'Dev server port.',
                defaultValue: DEFAULT_CONFIG.server.port,
                paramAction({ value, result }) {
                    result.config.server!.port = +value
                }
            },
            {
                flagLong: '--host',
                description: 'Dev server host.',
                defaultValue: DEFAULT_CONFIG.server.host,
                paramAction({ value, result }) {
                    result.config.server!.host = value as string
                }
            }
        ]
    },


    init: {
        description:    `Creates production ready project with predefined folder structure including already configured Siegel.
                        \r\tModifies existing ${LOC_NAMES.PACKAGE_JSON} or creates new one.
                        \r\tMore about demo project read here: ${getColoredHighlightText(`https://github.com/CyberCookie/siegel/tree/master/${LOC_NAMES.DEMO_APP_DIR_NAME}`)}`,
        example: true,
        commandAction({ result }) {
            const { isGlobal, isMini, isMiniServ } = result
            isMini
                ?   initMiniProject(isMiniServ)
                :   initProject(isGlobal)
        },
        prepareResult: () => ({
            isGlobal: false,
            isMini: false,
            isMiniServ: false
        }),
        params: [
            {
                flagLong: '--global',
                flag: '-g',
                defaultValue: false,
                description: 'Updates Siegel related paths to global.',
                paramAction({ result }) {
                    result.isGlobal = true
                }
            },
            {
                flagLong: '--mini',
                flag: '-m',
                defaultValue: false,
                description: 'Creates mini zero-config react TS project',
                paramAction({ result }) {
                    result.isMini = true
                }
            },
            {
                flagLong: '--mini-serv',
                flag: '-s',
                defaultValue: false,
                description: 'Creates mini zero-config react TS project with preconfigured TS express server',
                paramAction({ result }) {
                    result.isMini = true
                    result.isMiniServ = true
                }
            }
        ]
    },


    'create-ssl': {
        example: true,
        description:    `Creates localhost ssl certificate to be used with NodeJS server;
                        \r\tCreates authority certificate to be imported in a web browser for testing purposes.`,
        commandAction() {
            createSSLCerts()
        }
    },


    version: {
        description: 'Prints current Siegel version.',
        commandAction() {
            console.log(
                requireJSON(PATHS.packageJSON).version
            )
        }
    }
}


const CLI_ARGS = process.argv.slice(2)
const COMMAND = CLI_ARGS.shift() as Command

const commandConfig = COMMANDS_TREE[COMMAND] as Partial<ALlCommands>
if (commandConfig) {
    const { commandAction } = commandConfig as ALlCommands
    const { params, prepareResult } = commandConfig as Partial<CommandsWithParams>
    const result = prepareResult?.()

    const parseResult = parseCommandLineArgs(CLI_ARGS)
    const { CLIParamsValues } = parseResult

    let { unresolvedParamsCount } = parseResult
    for await (const param of params!) {
        const { flag, flagLong, paramAction } = param

        if (paramAction) {
            const paramValueData = CLIParamsValues[flagLong!] || CLIParamsValues[flag!]
            if (paramValueData) {
                paramValueData.resolved = true
                unresolvedParamsCount--

                await paramAction({
                    result: result as UnionToIntersection<ReturnType<CommandsWithParams['prepareResult']>>,
                    CLIParamsValues,
                    value: paramValueData.value
                })
            }
        }
    }


    if (unresolvedParamsCount) {
        const notSupportedParams: string[] = []
        Object.entries(CLIParamsValues)
            .forEach(([ CLIParam, CLIParamValue ]) => {
                CLIParamValue!.resolved || notSupportedParams.push(CLIParam)
            })

        if (notSupportedParams.length) {
            throw Error(`
                \rCommand ${getColoredCommandStr(COMMAND)} doesn't support following arguments: ${getColoredCommandArgumentStr(notSupportedParams.join(' '))}
            `)
        }
    }


    commandAction({ CLIParamsValues, result } as UnionToIntersection<Parameters<typeof commandAction>[0]>)

} else {
    COMMAND && console.log(`Command ${getColoredCommandStr(COMMAND)} doesn't exist.\n`)

    Object.entries(COMMANDS_TREE)
        .forEach(([ commandConfigKey, COMMAND ]) => {
            const { description, example } = COMMAND
            const { params } = COMMAND as Partial<CommandsWithParams>

            console.log(`\n  ${getColoredCommandStr(commandConfigKey)} - ${description}`)

            const flagsMap: PrintHelpFlagsMap = {}
            params?.forEach(paramConfg => {
                const { description, defaultValue, flag, flagLong } = paramConfg

                let logString = '\n\t'

                flag && (logString += getColoredCommandArgumentStr(flag))
                flag && flagLong && (logString += ' ')
                flagLong && (logString += getColoredCommandArgumentStr(flagLong))

                logString += ` - ${description}`

                if (utils.isExists(defaultValue)) {
                    logString += `\n\r\t\t${getColoredHighlightText(` Default value: ${defaultValue}`)}`
                }

                console.log(logString)

                flagsMap[flagLong.substring(2)] = { flag, flagLong }
            })

            if (example) {
                const exampleType = typeof example
                const logString = exampleType == 'function'
                    ?   (example as CommandExampleFn)(commandConfigKey, flagsMap)
                    :   exampleType == 'string'
                        ?   example
                        :   `siegel ${commandConfigKey}`

                console.log(`\n\tExample: ${getColoredHighlightText(logString as string)}\n`)
            }
        })

    console.log('\n')
}