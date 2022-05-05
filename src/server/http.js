import https from 'https'
import express from 'express'

import { HEADER_ACCEPT_INDEX } from './constants.js'
import extractSSL from './extract_ssl_key.js'
import getStaticServingData from './get_static_serving_data.js'


function rewriteSPAUrl(req, _, next) {
    const { headers, method } = req

    if (method == 'GET' && headers.accept.includes(HEADER_ACCEPT_INDEX)) {
        req.url = '/index.html'
    }

    next()
}


async function createHTTPServer(params) {
    const { devMiddlewares, appServer, CONFIG } = params
    const {
        publicDir,
        server: { ssl, serveCompressionsPriority }
    } = CONFIG


    let staticServer = express()

    appServer && await appServer({ staticServer, express }, CONFIG)

    staticServer.disable('x-powered-by')
        .use(rewriteSPAUrl)

    devMiddlewares.length
        ?   devMiddlewares.forEach(m => { staticServer.use(m) })

        :   staticServer.use((req, res) => {
                const {
                    pathToFile, encoding, contentType, cacheControl
                } = getStaticServingData({
                    publicDir, serveCompressionsPriority,
                    reqUrl: req.url,
                    headers: req.headers['accept-encoding']
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