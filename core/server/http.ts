import https from 'https'
import express from 'express'

import { HEADER_ACCEPT_INDEX } from './constants.js'
import extractSSL from './extract_ssl_key.js'
import getStaticServingData from './get_static_file_response_data/index.js'

import type { Express, RequestHandler } from 'express'
import type { ServerBootParams } from './types'


const rewriteSPAUrl: RequestHandler = (req, _, next) => {
    const { headers, method } = req

    if (method == 'GET' && headers.accept?.includes(HEADER_ACCEPT_INDEX)) {
        req.url = '/index.html'
    }

    next()
}


async function createHTTPServer(params: ServerBootParams) {
    const { devMiddlewares, appServer, CONFIG } = params
    const {
        publicDir,
        server: { ssl, serveCompressionsPriority }
    } = CONFIG


    let staticServer: Express | https.Server = express()

    appServer && await appServer({ staticServer, express }, CONFIG)

    staticServer.disable('x-powered-by')
        .use(rewriteSPAUrl)


    devMiddlewares.length
        ?   devMiddlewares.forEach(m => {
                (staticServer as Express).use(m)
            })

        :   staticServer.use((req, res) => {
                const { url, headers } = req
                const {
                    pathToFile, encoding, contentType, cacheControl
                } = getStaticServingData({
                    publicDir, serveCompressionsPriority,
                    reqUrl: url,
                    acceptEncoding: headers['accept-encoding']?.toString(),
                    cacheControl: headers['cache-control']
                })


                encoding && res.append('content-encoding', encoding)
                contentType && res.append('content-type', contentType)
                cacheControl && res.append('cache-control', cacheControl)

                res.sendFile(pathToFile)
            })


    ssl && (staticServer = https.createServer(
        extractSSL(ssl),
        staticServer
    ))


    return staticServer
}


export default createHTTPServer