import http from 'http'
import https from 'https'
import querystring from 'querystring'

import populateURLParams from '../../common/populate_url_params.js'


const proxy = (proxyParams: any) => {
    const { host, port, changeOrigin, postProcessReq, secure } = proxyParams

    const client = secure ? https : http


    return (clientReq: any, clientRes: any) => {
        const { path, method, headers, query, params, body } = clientReq


        const proxyQuery = proxyParams.query || query
        const proxyPath = proxyParams.path || path
        let finalPath = Object.keys(proxyQuery).length
            ?   `${proxyPath}?${querystring.stringify(proxyQuery)}`
            :   proxyPath

        params && (finalPath = populateURLParams(finalPath, params))


        const proxyHeaders = proxyParams.headers
        if (proxyHeaders) {
            proxyHeaders instanceof Function
                ?   proxyParams.headers(headers)
                :   Object.assign(headers, proxyHeaders)
        }
        if (changeOrigin) {
            headers.host = host
            port && (headers.host += `:${port}`)
        }


        const options = {
            host, port, headers,
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

            clientRes.writeHead(statusCode, headers)
            proxyRes.pipe(clientRes, { end: true })
        })
        body && proxyReq.write(
            body.constructor == Object
                ?   JSON.stringify(body)
                :   body
        )

        proxyReq.on('error', console.error)


        clientReq.pipe(proxyReq, { end: true })
    }
}


export default proxy