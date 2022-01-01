#!/usr/bin/env node
'use strict'

const { isAbsolute, join } = require('path')


const cwd = process.cwd()
const scriptArgs = process.argv.slice(2)
const command = scriptArgs.shift()


const getColoredCommandStr = str => `\x1b[36m${str}\x1b[0m`
const getColoredCommandArgumentStr = str => `\x1b[32m${str}\x1b[0m`


switch(command) {
    case 'run':
        var config = {
            server: {},
            build: {}
        }
        var runParams = {}

        for (let i = 0, l = scriptArgs.length; i < l; i++) {
            const argument = scriptArgs[i]


            switch(argument) {
                case '-p':
                    runParams.isProd = true
                    break

                case '-b':
                    runParams.isBuild = true
                    break

                case '-s':
                    runParams.isServer = true
                    break

                case '-lint':
                    config.build.eslint = true
                    break

                case '-cfg':
                    var cfgPath = scriptArgs[i + 1]
                    var pathNormalized = isAbsolute(cfgPath) ? cfgPath : join(cwd, cfgPath)

                    config = require(pathNormalized)

                    i++
                    break

                case '-js':
                    var jsPath = scriptArgs[i + 1]
                    config.build.input = {
                        js: isAbsolute(jsPath) ? jsPath : join(cwd, jsPath)
                    }

                    i++
                    break

                case '-port':
                    config.server.port = +scriptArgs[i + 1]
                    i++
            }
        }

        return require('../cjs')(config, runParams)


    case 'init':
        var isGlobal = scriptArgs[0] == '-g'
        return require('./init_project')(isGlobal)

    case 'create-ssl':
        return require('./create_SSL')()

    case '_hard-update':
        return require('./update_deps')()


    default:
        console.log(
`
    ${getColoredCommandStr('run')} - Main command to perform different operations with code 
        ${getColoredCommandArgumentStr('-p')}       - production mode
        ${getColoredCommandArgumentStr('-b')}       - build mode
        ${getColoredCommandArgumentStr('-s')}       - server mode
        ${getColoredCommandArgumentStr('-js')}      - path to js entrypoint
        ${getColoredCommandArgumentStr('-lint')}    - enable eslint
        ${getColoredCommandArgumentStr('-port')}    - static server port
        ${getColoredCommandArgumentStr('-cfg')}     - path to siegel config 

        example: ... run -b -s -js app.ts -port 4000
    

    ${getColoredCommandStr('init')} - Creates production ready project with predefined folder structure including already configured siegel.
           Modifies existing package.json or creates new one.
           More about demo project read here: https://github.com/CyberCookie/siegel/tree/master/demo_app

        ${getColoredCommandArgumentStr('-g')} - if siegel is installed globally
    

    ${getColoredCommandStr('create-ssl')} - Creates localhost ssl certificate to be used in NodeJS server.
                 Also it creates authority certificate for testing purposes to be imported in a web browser.

    
    ${getColoredCommandStr('_hard-update')} - [ WARNING! Force update may break your project dependencies ]
                   It's the fastest way to update packages, listed in 'dependencies' and 'devDependencies' fields, to the most latest versions.
                   Must be ran at project root level where package.json is.
`
        )
}