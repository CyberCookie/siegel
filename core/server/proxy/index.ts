import http from 'http'
import https from 'https'

import isEmptyObject from '../../../common/is/empty_obj'
import populateURLParams from '../../../common/populate_url_params'

import type { RequestHandler } from 'express'
import type { Proxy } from './types'


const proxy: Proxy = proxyParams => {
    const {
        host, port, changeOrigin, postProcessReq, secure
    } = proxyParams

    const client = secure ? https : http


    const proxyRequest: RequestHandler = (clientReq, clientRes) => {
        const { path, method, headers, query, params, body } = clientReq


        const proxyQuery = proxyParams.query || query
        const proxyPath = proxyParams.path || path
        let finalPath = isEmptyObject(proxyQuery)
            ?   proxyPath
            :   `${proxyPath}?${new URLSearchParams(proxyQuery as Obj<string>)}`

        params && (finalPath = populateURLParams(finalPath, params))


        const proxyHeaders = proxyParams.headers
        if (proxyHeaders) {
            proxyHeaders instanceof Function
                ?   proxyHeaders(headers)
                :   Object.assign(headers, proxyHeaders)
        }
        if (changeOrigin) {
            headers.host = host
            port && (headers.host += `:${port}`)
        }


        const options = {
            host, headers,
            port: !port && secure ? 443 : port,
            method: proxyParams.method || method,
            path: finalPath
        }
        postProcessReq && postProcessReq(clientReq, options)


        const proxyReq = client.request(options, proxyRes => {
            const { statusCode, headers } = proxyRes
            if (statusCode !== 200) {
                console.error(path, statusCode)
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