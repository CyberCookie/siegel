import http2 from 'http2'

import { HEADER_ACCEPT_INDEX } from '../constants.js'
import extractSSL from '../extract_ssl_key.js'
import getStaticServingData from '../get_static_file_response_data'

import type { ServerBootParams } from '../types'
import type { StreamCB } from './types'


async function createHTTP2Server(params: ServerBootParams) {
    const { devMiddlewares, config } = params
    const { publicDir, server } = config
    const { ssl, serveCompressionsPriority, appServer, HTTP2PreFileSend } = server!

    const {
        HTTP2_HEADER_CONTENT_ENCODING, HTTP2_HEADER_ACCEPT, HTTP2_HEADER_ACCEPT_ENCODING,
        HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS, HTTP2_HEADER_METHOD, HTTP2_HEADER_CACHE_CONTROL,
        HTTP2_HEADER_CONTENT_TYPE, HTTP2_METHOD_GET
    } = http2.constants


    const staticServer = ssl
        ?   http2.createSecureServer(extractSSL(ssl))
        :   http2.createServer()

    staticServer.on('error', console.error)

    staticServer.on('stream', (stream, headers, flags) => {
        const cancelFurtherPricessing = onStreamCb?.(stream, headers, flags)

        if (!(devMiddlewares.length || cancelFurtherPricessing)) {
            const reqUrl = headers[HTTP2_HEADER_METHOD] == HTTP2_METHOD_GET
                && headers[HTTP2_HEADER_ACCEPT]?.includes(HEADER_ACCEPT_INDEX)
                    ?   '/index.html'
                    :   headers[HTTP2_HEADER_PATH]!

            const staticServingData = getStaticServingData({
                reqUrl, serveCompressionsPriority,
                publicDir: publicDir!,
                acceptEncoding: headers[ HTTP2_HEADER_ACCEPT_ENCODING ],
                cacheControl: headers[ HTTP2_HEADER_CACHE_CONTROL ]
            })
            const {
                pathToFile, encoding, contentType, cacheControl
            } = staticServingData


            const resHeaders: http2.OutgoingHttpHeaders = {}
            contentType && (resHeaders[HTTP2_HEADER_CONTENT_TYPE] = contentType)
            encoding && (resHeaders[HTTP2_HEADER_CONTENT_ENCODING] = encoding)
            cacheControl && (resHeaders[HTTP2_HEADER_CACHE_CONTROL] = cacheControl)


            if (!HTTP2PreFileSend?.(stream, headers, resHeaders, staticServingData)) {
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
        }
    })


    let onStreamCb: StreamCB
    appServer && await appServer({
        staticServer,
        onStream(cb: StreamCB) {
            onStreamCb = cb
        }
    }, config)


    return staticServer
}


export default createHTTP2Server