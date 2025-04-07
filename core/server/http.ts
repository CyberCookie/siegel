import https from 'https'
import express, { Express, RequestHandler } from 'express'

import { HEADER_ACCEPT_INDEX } from './constants.js'
import extractSSL from './extract_ssl_key.js'
import getStaticServingData from './get_static_file_response_data'

import type { ServerBootParams } from './types'


const rewriteSPAUrl: RequestHandler = (req, _, next) => {
    const { headers, method } = req

    if (method == 'GET' && headers.accept?.includes(HEADER_ACCEPT_INDEX)) {
        req.url = '/index.html'
    }

    next()
}


async function createHTTPServer(params: ServerBootParams) {
    const { devMiddlewares, config } = params
    const { publicDir, server } = config
    const { ssl, serveCompressionsPriority, appServer, HTTP1PreFileSend } = server!


    const staticServer: Express = express()
    appServer && await appServer({ staticServer, express }, config)

    staticServer.disable('x-powered-by')
        .use(rewriteSPAUrl)


    devMiddlewares.length
        ?   devMiddlewares.forEach(m => {
                (staticServer as Express).use(m)
            })

        :   staticServer.use((req, res) => {
                const { url, headers } = req
                const staticServingData = getStaticServingData({
                    serveCompressionsPriority,
                    publicDir: publicDir!,
                    reqUrl: url,
                    acceptEncoding: headers['accept-encoding']?.toString(),
                    cacheControl: headers['cache-control']
                })
                const {
                    pathToFile, encoding, contentType, cacheControl
                } = staticServingData


                encoding && res.append('content-encoding', encoding)
                contentType && res.append('content-type', contentType)
                cacheControl && res.append('cache-control', cacheControl)


                HTTP1PreFileSend?.(req, res, staticServingData) || res.sendFile(pathToFile)
            })


    return ssl
        ?   https.createServer(extractSSL(ssl), staticServer)
        :   staticServer
}


export default createHTTPServer