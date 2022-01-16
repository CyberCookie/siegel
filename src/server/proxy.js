import http from 'http'
import querystring from 'querystring'

import populateURLParams from '../../utils_cross_env/populate_url_params.js'


const proxy = proxyParams => {
    const { host, port, changeOrigin, postProcessReq } = proxyParams


    return (clientReq, clientRes) => {
        const { path, method, headers, query, params } = clientReq


        const proxyQuery = proxyParams.query || query
        const proxyPath = proxyParams.path || path
        let finalPath = Object.keys(proxyQuery).length
            ?   `${proxyPath}?${querystring.stringify(proxyQuery)}`
            :   proxyPath

        params && (finalPath = populateURLParams(finalPath, params))


        const proxyHeaders = proxyParams.headers
        if (proxyHeaders) {
            proxyHeaders.constructor == Function
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


        const proxyReq = http.request(options, proxyRes => {
            const { statusCode, headers } = proxyRes
            if (statusCode !== 200) {
                console.error(path, statusCode)
                proxyRes.resume()
            }

            clientRes.writeHead(statusCode, headers)

            proxyRes.pipe(clientRes, { end: true })
        })
        .on('error', console.error)


        clientReq.pipe(proxyReq, { end: true })
    }
}


export default proxy