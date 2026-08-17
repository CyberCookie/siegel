process.on('warning', console.warn)
process.on('uncaughtException', console.error)

const { INIT_CWD, PWD } = process.env
if (INIT_CWD && INIT_CWD !== PWD) {
    process.chdir(INIT_CWD)
}


import getConfig from './get_config.js'
import { clientBuilder } from './client_build'
import { bootServer } from './server'

import type { Config, WebpackMiddlewares } from './types'



async function main(userConfig?: Config) {

    const config = getConfig(userConfig)
    const { isBuild, isServer, isProd } = config.runMode


    let devMiddlewares: Partial<WebpackMiddlewares> = {}
    if (isBuild) {
        const { run, getDevMiddlewares } = clientBuilder(config)

        await run()

        if (isServer && !isProd) {
            devMiddlewares = getDevMiddlewares()
        }
    }


    isServer && bootServer.run({
        devMiddlewares: devMiddlewares as WebpackMiddlewares,
        config
    })
}

import.meta.main && main()



export default main
export { getConfig }
export * as utils from 'siegel-utils'
export * as nodeUtils from './utils'
export * as clientBuildUtils from './client_build'
export * as serverUtils from './server'

export type * from './types'
export type {
    ServerExtenderFn,
    FastifyHTTPServer, FastifyHTTPServerSecure, FastifyHTTP2Server, FastifyHTTP2ServerSecure
} from './types'