const { join }          = require('path')
const glob              = require('glob')
const { PATHS }         = require('../constants')
const buildConstants    = require('./constants')


const { pluginsKeysMap, loadersKeyMap, webpackModulesRegExp } = buildConstants


module.exports = () => {
    const RUN_PARAMS = {
        isBuild: true,
        isProd: true
    }

    const CONFIG = {
        build: {
            input: {},

            plugins: {
                [ pluginsKeysMap.compression ]: false,
                [ pluginsKeysMap.html ]: false,
                [ pluginsKeysMap.eslint ]: false
            },

            modules: {
                [ webpackModulesRegExp.styles ]: {
                    loadersOrder(defaultOrder) {
                        const indexOfSassResourceLoader = defaultOrder.indexOf(loadersKeyMap.sassResources)
                        defaultOrder.splice(indexOfSassResourceLoader, 1)

                        return defaultOrder
                    },
                    loaders: {
                        [ loadersKeyMap.sassResources ]: false
                    }
                }
            },

            postProcessWebpackConfig(webpackConfig) {
                const entry = glob.sync(
                    join(PATHS.clientCore, '**', '*.ts*'),
                    {
                        //TODO: make it buildable
                        ignore: [
                            '**/signalr*',
                            '**/store/redux/**/*',
                            '**/ui/Spinner/**/*'
                        ]
                    }
                )
                console.log(entry)
                webpackConfig.entry = [ ...entry ]

                webpackConfig.output = {
                    // module: true,
                    clean: true,
                    filename: '[file]',
                    path: join(PATHS.cwd, 'lib_client')
                }

                webpackConfig.experiments = {
                    outputModule: true
                }

                delete webpackConfig.cache
                delete webpackConfig.resolve.alias


                return webpackConfig
            }
        }
    }


    return { RUN_PARAMS, CONFIG }
}
export {}