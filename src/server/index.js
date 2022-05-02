import mime from 'mime'

import extractSSL from './extract_ssl_key.js'
import getStaticServingData from './get_static_serving_data.js'


const listen = (server, host, port) => (
    server.listen(port, host, err => {
        err
            ?   console.error(err)
            :   console.info('Starting server on %s:%s.', host, port)
    })
)


async function createHTTPServer(params) {
    const {
        devMiddlewares, appServer,
        CONFIG: {
            publicDir,
            server: { host, port, ssl, compressionServingOrder }
        }
    } = params


    const express = (await import('express')).default

    let staticServer = express()
    staticServer.disable('x-powered-by')

    appServer && await appServer(staticServer, { express })


    devMiddlewares.length
        ?   devMiddlewares.forEach(m => {
                staticServer.use(m)
            })

        :   staticServer.use('/*', (req, res) => {
                const { originalUrl, headers } = req

                const {
                    pathToFile, encoding, contentType
                } = getStaticServingData(publicDir, originalUrl, headers, compressionServingOrder)

                encoding && res.append('content-encoding', encoding)
                contentType && res.append('content-type', contentType)
                res.sendFile(pathToFile)
            })


    if (ssl) {
        const { createServer } = await import('https')
        staticServer = createServer(extractSSL(ssl), staticServer)
    }


    return listen(staticServer, host, port)
}


async function createHTTP2Server(params) {
    const {
        devMiddlewares, appServer,
        CONFIG: {
            publicDir,
            server: { host, port, compressionServingOrder, ssl }
        }
    } = params

    const http2 = await import('http2')

    const {
        HTTP2_HEADER_CONTENT_ENCODING,
        HTTP2_CONTENT_TYPE_KEY,
        HTTP2_HEADER_PATH,
        HTTP2_HEADER_STATUS
    } = http2.constants


    const server = ssl
        ?   http2.createSecureServer(extractSSL(ssl))
        :   http2.createServer()

    server.on('error', console.error)

    server.on('stream', (stream, headers, flags) => {

        if (!devMiddlewares.length) {

            const cancelFurtherPricessing = onStreamCb?.(stream, headers, flags)
            if (!cancelFurtherPricessing) {
                const reqFilePath = headers[HTTP2_HEADER_PATH]

                const {
                    pathToFile, encoding, contentType
                } = getStaticServingData(publicDir, reqFilePath, headers, compressionServingOrder)


                console.log(pathToFile, encoding, contentType)

                stream.respondWithFile(
                    pathToFile,
                    {
                        [ HTTP2_CONTENT_TYPE_KEY ]: contentType,
                        [ HTTP2_HEADER_CONTENT_ENCODING ]: encoding
                    },
                    {
                        onError(err) {
                            console.log(err)
                            stream.respond({
                                [HTTP2_HEADER_STATUS]: err.code == 'ENOENT' ? 404 : 500
                            })

                            stream.end()
                        }
                    }
                )
            }
        }
    })


    let onStreamCb
    appServer && await appServer(server, {
        mime,
        onStream(cb) {
            onStreamCb = cb
        }
    })


    return listen(server, host, port)
}


const server = {
    run: params => params.CONFIG.server.http2
        ?   createHTTP2Server(params)
        :   createHTTPServer(params)
}


export default server