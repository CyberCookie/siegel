import http2 from 'http2'

import { HEADER_ACCEPT_INDEX } from './constants.js'
import extractSSL from './extract_ssl_key.js'
import getStaticServingData from './get_static_serving_data.js'


async function createHTTP2Server(params: any) {
    const { devMiddlewares, appServer, CONFIG } = params
    const {
        publicDir,
        server: { ssl, serveCompressionsPriority }
    } = CONFIG

    const {
        HTTP2_HEADER_CONTENT_ENCODING, HTTP2_HEADER_ACCEPT, HTTP2_HEADER_ACCEPT_ENCODING,
        HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS, HTTP2_HEADER_METHOD, HTTP2_HEADER_CACHE_CONTROL,
        HTTP2_HEADER_CONTENT_TYPE, HTTP2_METHOD_GET
    } = http2.constants


    const staticServer = ssl
        ?   http2.createSecureServer(extractSSL(ssl))
        :   http2.createServer()

    staticServer.on('error', console.error)

    staticServer.on('stream', (stream, headers: any, flags) => {
        const cancelFurtherPricessing = onStreamCb?.(stream, headers, flags)

        if (!(devMiddlewares.length || cancelFurtherPricessing)) {
            const reqUrl = headers[HTTP2_HEADER_METHOD] == HTTP2_METHOD_GET
                && headers[HTTP2_HEADER_ACCEPT].includes(HEADER_ACCEPT_INDEX)
                    ?   '/index.html'
                    :   headers[HTTP2_HEADER_PATH]

            const {
                pathToFile, encoding, contentType, cacheControl
            } = getStaticServingData({
                publicDir, reqUrl, serveCompressionsPriority,
                acceptEncoding: headers[ HTTP2_HEADER_ACCEPT_ENCODING ],
                cacheControl: headers[ HTTP2_HEADER_CACHE_CONTROL ]
            })


            const resHeaders: any = {}
            contentType && (resHeaders[HTTP2_HEADER_CONTENT_TYPE] = contentType)
            encoding && (resHeaders[HTTP2_HEADER_CONTENT_ENCODING] = encoding)
            cacheControl && (resHeaders[HTTP2_HEADER_CACHE_CONTROL] = cacheControl)

            stream.respondWithFile(pathToFile, resHeaders, {
                onError(err) {
                    console.log(err)
                    stream.respond({
                        [HTTP2_HEADER_STATUS]: err.code == 'ENOENT' ? 404 : 500
                    })

                    stream.end()
                }
            })
        }
    })


    let onStreamCb: any
    appServer && await appServer({
        staticServer,
        onStream(cb: any) {
            onStreamCb = cb
        }
    }, CONFIG)


    return staticServer
}


export default createHTTP2Server