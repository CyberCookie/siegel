process.on('warning', console.warn)
process.on('uncaughtException', console.error)

const { INIT_CWD, PWD } = process.env
if (INIT_CWD && INIT_CWD != PWD) {
    process.chdir(INIT_CWD)
}


import * as utils from '../common'
import * as nodeUtils from './utils'
import getConfig from './get_config.js'
import webpackBuilder, { BUILD_CONSTANTS } from './client_build'
import {
    bootServer, getStaticServingData, http2Server, httpServer, proxyReq,
    extractSSL
} from './server'

import type { RequestHandler } from 'express'
import type {
    Config, ServerExtenderFn, ExpressExtenderParams, HTTP2ExtenderParams
} from './types'


async function main(userConfig?: Config) {

    const config = getConfig(userConfig)
    const { isBuild, isServer, isProd } = config.runMode


    let devMiddlewares: RequestHandler[] = []
    if (isBuild) {
        const { run, getDevMiddlewares } = webpackBuilder(config)

        await run()

        if (isServer && !isProd) {
            devMiddlewares = Object.values(getDevMiddlewares())
        }
    }


    isServer && bootServer.run({ devMiddlewares, config })
}

nodeUtils.isRunDirectly(import.meta) && main()


export default main
export {
    webpackBuilder, BUILD_CONSTANTS, getConfig,
    bootServer, getStaticServingData, http2Server, httpServer, proxyReq, extractSSL,
    nodeUtils, utils
}
export type {
    Config, ServerExtenderFn, ExpressExtenderParams, HTTP2ExtenderParams
}