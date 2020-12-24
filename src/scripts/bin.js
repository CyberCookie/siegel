#!/usr/bin/env node
const { isAbsolute, join } = require('path')

const scriptArgs = process.argv.slice(2)
const command = scriptArgs.shift()


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
                    runParams.isProd = true;
                    break;
                
                case '-b':
                    runParams.isBuild = true;
                    break;

                case '-s':
                    runParams.isServer = true;
                    break;

                case '-cfg':
                    var cfgPath = scriptArgs[i + 1]
                    var pathNormalized = isAbsolute(cfgPath) ? cfgPath : join(process.cwd(), cfgPath)
                    
                    config = require(pathNormalized)
                    i++
                    break;

                case '-js':
                    var jsPath = scriptArgs[i + 1]
                    config.build = {
                        input: {
                            js: isAbsolute(jsPath) ? jsPath : join(process.cwd(), jsPath)
                        }
                    }
                    i++
                    break;
                
                case '-port':
                    config.server.port = +scriptArgs[i + 1]
            }
        }

        return require('../index')(config, runParams)


    case 'init':
        var isGlobal = scriptArgs[0] == '-g'
        return require('./init_project')(isGlobal)
    
    case 'create-ssl':
        return require('./create_SSL')()

    case 'install-peers':
        return require('./install_peers')()
    
    case '_hard-update':
        return require('./update_deps')()
    
    
    default:
        console.log(
`
    run - main command to perform different operations with code 
        -p - production mode
        -b - build mode
        -s - server mode
        -js - path to js entrypoint
        -port - static server port
        -cfg - path to siegel config 

        example: ... run -b -s -js ./app.ts -port 4000

    init - creates project template and creates or updates cwd package.json
        -g - if siegel is installed globally
    
    create-ssl - creates SSL files.  
    
    install-peers - installs siegel's peer dependencies in a cwd package.json
    
    _hard-update - updates all the dependencies and dev dependencies in a cwd package.json
`
        )
}