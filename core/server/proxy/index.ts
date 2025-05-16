import http, { Server, IncomingHttpHeaders, IncomingMessage, RequestOptions } from 'http'
import https from 'https'

import isEmptyObject from '../../../common/is/empty_obj'
import populateURLParams from '../../../common/populate_url_params'

import type { Socket } from 'net'
import type { RequestHandler } from 'express'
import type { Proxy, ProxyParams } from './types'


const createHttpHeader = (line: string, headers: IncomingHttpHeaders) => (
    Object.keys(headers)
        .reduce(
            (head, key) => {
                const value = headers[key]

                if (Array.isArray(value)) {
                    for (let i = 0; i < value.length; i++) {
                        head.push(`${key}: ${value[i]}`)
                    }

                } else head.push(`${key}: ${value}`)

                return head
            },
            [ line ]
        )
        .join('\r\n') + '\r\n\r\n'
    )

function updateSocket(socket: Socket, head: Buffer<ArrayBufferLike>) {
    socket.setTimeout(0)
    socket.setNoDelay(true)
    socket.setKeepAlive(true, 0)
    head?.length && socket.unshift(head)
}

function getProxyRequestOptions(
    proxyParams: ProxyParams,
    clientReq: Parameters<RequestHandler>[0] | IncomingMessage,
    isWS?: boolean
) {

    const { host, port, changeOrigin, postProcessReq, secure } = proxyParams
    const { url, method, headers } = clientReq

    let finalPath: string
    if (isWS) finalPath = url!
    else {
        const { query, params, path } = clientReq as Parameters<RequestHandler>[0]

        const proxyQuery = proxyParams.query || query
        const proxyPath = proxyParams.path || path
        finalPath = isEmptyObject(proxyQuery)
            ?   proxyPath
            :   `${proxyPath}?${new URLSearchParams(proxyQuery as NonNullableProps<Obj<string>>)}`

        params && (finalPath = populateURLParams(finalPath, params))
    }


    const proxyReqOptions = {
        host, method, headers,
        port: !port && secure ? 443 : port,
        path: finalPath
    } satisfies RequestOptions

    if (changeOrigin) {
        proxyReqOptions.headers!.host = host
        port && (proxyReqOptions.headers!.host += `:${port}`)
    }

    postProcessReq?.(clientReq, proxyReqOptions)


    return proxyReqOptions
}

const proxy: Proxy = proxyParams => {
    const { secure, ws } = proxyParams

    const client = secure ? https : http
    let wsOnUpgradeSubscribed = false


    const proxyRequest: RequestHandler = (clientReq, clientRes) => {
        const { body, socket } = clientReq

        if (ws && !wsOnUpgradeSubscribed) {
            (socket as Socket & { server: Server }).server
                .on('upgrade', (req, socket: Socket, head) => {
                    updateSocket(socket, head)


                    client.request(
                        getProxyRequestOptions(proxyParams, req, true)
                    )
                    .on('upgrade', (pRes, pSocket, pHead) => {
                        updateSocket(pSocket, pHead)

                        socket.write(
                            createHttpHeader(
                                'HTTP/1.1 101 Switching Protocols',
                                pRes.headers
                            )
                        )

                        pSocket.pipe(socket).pipe(pSocket)
                    })
                    .on('response', res => {
                        const { headers, httpVersion, statusCode, statusMessage } = res
                        socket.write(
                            createHttpHeader(
                                `HTTP/${httpVersion} ${statusCode} ${statusMessage}`,
                                headers
                            )
                        )

                        res.pipe(socket)
                    })
                    .on('error', console.error)
                    .end()
                })

            wsOnUpgradeSubscribed = true
        }


        const proxyReq = client.request(
            getProxyRequestOptions(proxyParams, clientReq),
            proxyRes => {
                const { statusCode, headers } = proxyRes
                if (statusCode !== 200) {
                    console.error(clientReq.path, statusCode)
                    proxyRes.resume()
                }

                clientRes.writeHead(statusCode!, headers)
                proxyRes.pipe(clientRes)
            })
        body && proxyReq.write(
            body.constructor == Object
                ?   JSON.stringify(body)
                :   body
        )

        proxyReq.on('error', console.error)


        clientReq.pipe(proxyReq)
    }


    return proxyRequest
}


export default proxy