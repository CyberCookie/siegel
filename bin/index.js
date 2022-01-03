#!/usr/bin/env node
//TODO: console output: checkboxes, progress, timings
//TODO: merge CLI_PARAMS with CLI_COMMANDS
'use strict'

const { isAbsolute, join }  = require('path')
const { PATHS }             = require('../cjs/constants')


const scriptArgs = process.argv.slice(2)
const command = scriptArgs.shift()


const getColored = (color, str) => `\x1b[${color}m${str}\x1b[0m`
const getColoredCommandStr = getColored.bind(null, 36)
const getColoredCommandArgumentStr = getColored.bind(null, 32)
const getColoredHighlightText = getColored.bind(null, 33)
const getColoredWarningText = getColored.bind(null, 31)



const CLI_PARAMS = {
    isProd: '-p',
    isBuild: '-b',
    isServer: '-s',
    enableEslint: '-lint',
    siegelGlobal: '-g',
    siegelConfig: '-cfg',
    clientEntrySrc: '-client',
    serverEntrySrc: '-server',
    devServerPort: '-port'
}
const COMMAND_RUN = 'run'
const COMMAND_INIT = 'init'
const COMMAND_SSL_CREATE = 'create-ssl'
const COMMAND_HARD_UPDATE = '_hard-update'



switch(command) {
    case COMMAND_RUN:
        var config = {
            server: {},
            build: {}
        }
        var runParams = {}

        for (let i = 0, l = scriptArgs.length; i < l; i++) {
            const argument = scriptArgs[i]


            switch(argument) {
                case CLI_PARAMS.isProd:
                    runParams.isProd = true
                    break

                case CLI_PARAMS.isBuild:
                    runParams.isBuild = true
                    break

                case CLI_PARAMS.isServer:
                    runParams.isServer = true
                    break

                case CLI_PARAMS.enableEslint:
                    config.build.eslint = true
                    break

                case CLI_PARAMS.siegelConfig:
                    var cfgPath = scriptArgs[i + 1]
                    var pathNormalized = isAbsolute(cfgPath)
                        ?   cfgPath
                        :   join(PATHS.cwd, cfgPath)

                    config = require(pathNormalized)

                    i++
                    break

                case CLI_PARAMS.clientEntrySrc:
                    var jsPath = scriptArgs[i + 1]
                    config.build.input = {
                        js: isAbsolute(jsPath)
                            ?   jsPath
                            :   join(PATHS.cwd, jsPath)
                    }

                    i++
                    break

                case CLI_PARAMS.serverEntrySrc:
                    var nodeJsPath = scriptArgs[i + 1]
                    config.server.appServerLoc = isAbsolute(nodeJsPath)
                        ?   nodeJsPath
                        :   join(PATHS.cwd, nodeJsPath)

                    config.server.watch = true

                    i++
                    break

                case CLI_PARAMS.devServerPort:
                    config.server.port = +scriptArgs[i + 1]
                    i++
            }
        }

        return require('../cjs')(config, runParams)


    case COMMAND_INIT:
        var isGlobal = scriptArgs[0] == CLI_PARAMS.siegelGlobal
        return require('./init_project')(isGlobal)

    case COMMAND_SSL_CREATE:
        return require('./create_SSL')()

    case COMMAND_HARD_UPDATE:
        return require('./update_deps')()


    default:
        console.log(
`
    ${getColoredCommandStr(COMMAND_RUN)} - bootstrap application
        ${getColoredCommandArgumentStr(CLI_PARAMS.isProd)} - production mode
        ${getColoredCommandArgumentStr(CLI_PARAMS.isBuild)} - build mode
        ${getColoredCommandArgumentStr(CLI_PARAMS.isServer)} - server mode
        ${getColoredCommandArgumentStr(CLI_PARAMS.clientEntrySrc)} - path to client js entrypoint. ${getColoredHighlightText('Default: cwd + app.ts')}
        ${getColoredCommandArgumentStr(CLI_PARAMS.serverEntrySrc)} - path to server js entrypoint
        ${getColoredCommandArgumentStr(CLI_PARAMS.enableEslint)} - enable eslint. ${getColoredHighlightText('Default: false')}
        ${getColoredCommandArgumentStr(CLI_PARAMS.devServerPort)} - dev static server port. ${getColoredHighlightText('Default: 3000')}
        ${getColoredCommandArgumentStr(CLI_PARAMS.siegelConfig)} - path to siegel config 

        example: ... run ${CLI_PARAMS.clientEntrySrc} app.ts ${CLI_PARAMS.serverEntrySrc} server.js ${CLI_PARAMS.devServerPort} 4000
    

    ${getColoredCommandStr(COMMAND_INIT)} - Creates production ready project with predefined folder structure including already configured siegel.
           Modifies existing package.json or creates new one.
           More about demo project read here: https://github.com/CyberCookie/siegel/tree/master/demo_app

        ${getColoredCommandArgumentStr(CLI_PARAMS.siegelGlobal)} - if siegel is installed globally
    

    ${getColoredCommandStr(COMMAND_SSL_CREATE)} - Creates localhost ssl certificate to be used in NodeJS server.
                 Also it creates authority certificate for testing purposes to be imported in a web browser.

    
    ${getColoredCommandStr(COMMAND_HARD_UPDATE)} - ${getColoredWarningText('[ WARNING! Force update may break your project dependencies ]')}
                   It's the fastest way to update packages, listed in 'dependencies' and 'devDependencies' fields, to the most latest versions.
                   Must be ran at project root level where package.json is.
`
        )
}