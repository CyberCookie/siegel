#!/usr/bin/env node

//TODO?: console output: checkboxes, progress, timings
'use strict'

import path from 'path'

import { globalNodeModulesPath, requireJSON, parseCommandLineArgs } from '../src/utils/index.js'
import { LOC_NAMES, PATHS, DEFAULT_CONFIG, DEFAULT_RUN_PARAMS } from '../src/constants.js'
import normalizeConfig from '../src/normalize_configs.js'
import siegel from '../src/index.js'
import initProject from './init_project.js'
import createSSLCerts from './create_SSL.js'



const getColored = (color, str) => `\x1b[${color}m${str}\x1b[0m`
const getColoredCommandStr = getColored.bind(null, 36)
const getColoredCommandArgumentStr = getColored.bind(null, 32)
const getColoredHighlightText = getColored.bind(null, 33)

const resolvePath = _path => path.isAbsolute(_path) ? _path : `${PATHS.cwd}/${_path}`



const COMMANDS_TREE = {
    run: {
        description: 'Builds client and runs dev server with client watch mode enabled.',
        example: (command, { client, server, port }) => (
            `siegel ${command} ${client.flagLong} app.ts ${server.flagLong} server.js ${port.flagLong} 4000`
        ),
        prepareResult: () => ({
            config: DEFAULT_CONFIG,
            runParams: DEFAULT_RUN_PARAMS
        }),
        commandAction({ result, CLIParamsValues }) {
            const { config, runParams } = result
            siegel(config, runParams, !CLIParamsValues['--config'])
        },
        params: [
            {
                flagLong: '--production',
                flag: '-p',
                description: 'Production mode.',
                defaultValue: DEFAULT_RUN_PARAMS.isProd,
                paramAction({ value, result }) {
                    result.runParams.isProd = value
                }
            },
            {
                flagLong: '--build-only',
                flag: '-b',
                description: 'Builds client with no static server enabled.',
                defaultValue: false,
                paramAction({ result }) {
                    result.runParams.isServer = false
                }
            },
            {
                flagLong: '--serv-only',
                flag: '-s',
                description: 'Build client and run dev server with client watch mode enabled.',
                defaultValue: false,
                paramAction({ result }) {
                    result.runParams.isBuild = false
                }
            },
            {
                flagLong: '--config',
                description: 'Path to siegel config.',
                async paramAction({ value, result }) {
                    const resolvedPath = resolvePath(value)

                    const config = value.endsWith('.json')
                        ?   requireJSON(resolvedPath)
                        :   (await import(resolvedPath)).default

                    result.config = normalizeConfig(config, result.runParams)
                }
            },
            {
                flagLong: '--eslint',
                flag: '-l',
                description: 'Enables lintng with ESLint.',
                defaultValue: DEFAULT_CONFIG.build.eslint,
                paramAction({ value, result }) {
                    result.config.build.eslint = value
                }
            },
            {
                flagLong: '--resolve-globals',
                flag: '-g',
                description: 'Enable resolve global node modules imports.',
                defaultValue: false,
                paramAction({ result }) {
                    result.config.build.postProcessWebpackConfig = webpackConfig => {
                        webpackConfig.resolve.modules.push(
                            globalNodeModulesPath()
                        )

                        return webpackConfig
                    }
                }
            },
            {
                flagLong: '--client',
                description: 'Path to client app entrypoint. [ js, ts, jsx, tsx ]',
                defaultValue: DEFAULT_CONFIG.build.input.js,
                paramAction({ value, result }) {
                    result.config.build.input = {
                        js: resolvePath(value)
                    }
                }
            },
            {
                flagLong: '--server',
                description: 'Path to server app entrypoint. [ js ]',
                paramAction({ value, result }) {
                    result.config.server.appServerLoc = resolvePath(value)
                }
            },
            {
                flagLong: '--port',
                description: 'Dev server port.',
                defaultValue: DEFAULT_CONFIG.server.port,
                paramAction({ value, result }) {
                    result.config.server.port = value
                }
            },
            {
                flagLong: '--host',
                description: 'Dev server host.',
                defaultValue: DEFAULT_CONFIG.server.host,
                paramAction({ value, result }) {
                    result.config.server.host = value
                }
            }
        ]
    },


    init: {
        description:    `Creates production ready project with predefined folder structure including already configured siegel.
                        \r\tModifies existing ${LOC_NAMES.PACKAGE_JSON} or creates new one.
                        \r\tMore about demo project read here: ${getColoredHighlightText('https://github.com/CyberCookie/siegel/tree/master/demo_app')}`,
        example: true,
        commandAction({ CLIParamsValues }) {
            initProject(CLIParamsValues.globalSiegel)
        },
        params: [{
            flagLong: '--global',
            flag: '-g',
            defaultValue: false,
            description: 'Updates Siegel related paths to global.'
        }]
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

const COMMAND = CLI_ARGS.shift()
const commandConfig = COMMANDS_TREE[COMMAND]
if (commandConfig) {
    const { params, commandAction, prepareResult } = commandConfig
    const result = prepareResult?.()

    let { CLIParamsValues, unresolvedParamsCount } = parseCommandLineArgs(CLI_ARGS)

    params && params.forEach(param => {
        const { flag, flagLong, paramAction } = param
        if (paramAction) {
            const paramValueData = CLIParamsValues[flagLong] || CLIParamsValues[flag]
            if (paramValueData) {
                paramValueData.resolved = true
                unresolvedParamsCount--

                paramAction({
                    result,
                    value: paramValueData.value,
                    CLIParamsValues
                })
            }
        }
    })

    if (unresolvedParamsCount) {
        const notSupportedParams = []
        for (const CLIParam in CLIParamsValues) {
            CLIParamsValues[CLIParam].resolved || notSupportedParams.push(CLIParam)
        }

        if (notSupportedParams.length) {
            throw Error(`
                \rCommand ${getColoredCommandStr(COMMAND)} doesn't support following arguments: ${getColoredCommandArgumentStr(notSupportedParams.join(' '))}
            `)
        }
    }


    commandAction({ CLIParamsValues, result })
} else {
    COMMAND && console.log(`Command ${getColoredCommandStr(COMMAND)} doesn't exist.\n`)

    for (const commandConfigKey in COMMANDS_TREE) {
        const { description, example, params } = COMMANDS_TREE[commandConfigKey]

        console.log(`\n  ${getColoredCommandStr(commandConfigKey)} - ${description}`)

        const flagsMap = {}
        params && params.forEach(paramConfg => {
            const { description, defaultValue, flag, flagLong } = paramConfg

            let logString = '\n\t'

            flag && (logString += getColoredCommandArgumentStr(flag))
            flag && flagLong && (logString += ' ')
            flagLong && (logString += getColoredCommandArgumentStr(flagLong))

            logString += ` - ${description}`

            if (defaultValue !== undefined) {
                logString += `\n\r\t\t${getColoredHighlightText(` Default value: ${defaultValue}`)}`
            }

            console.log(logString)

            flagsMap[flagLong.substr(2)] = { flag, flagLong }
        })

        if (example) {
            const exampleType = typeof example
            const logString = exampleType == 'function'
                ?   example(commandConfigKey, flagsMap)
                :   exampleType == 'string'
                    ?   example
                    :   `siegel ${commandConfigKey}`

            console.log(`\n\tExample: ${getColoredHighlightText(logString)}\n`)
        }
    }
    console.log('\n')
}