"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const querystring = require('querystring');
const proxy = (proxyParams) => {
    const { host, port, changeOrigin, postProcessReq } = proxyParams;
    return (clientReq, clientRes) => {
        const { path, method, headers, query, params } = clientReq;
        const proxyQuery = proxyParams.query || query;
        const proxyPath = proxyParams.path || path;
        let finalPath = Object.keys(proxyQuery).length
            ? `${proxyPath}?${querystring.stringify(proxyQuery)}`
            : proxyPath;
        //TODO: duplicate in client_core/request
        if (params) {
            for (const param in params) {
                finalPath = finalPath.replace(':' + param, params[param]);
            }
        }
        const proxyHeaders = proxyParams.headers;
        if (proxyHeaders) {
            typeof proxyHeaders == 'function'
                ? proxyParams.headers(headers)
                : Object.assign(headers, proxyHeaders);
        }
        changeOrigin && (headers.host = `${host}${port ? ':' + port : ''}`);
        const options = {
            host, port, headers,
            method: proxyParams.method || method,
            path: finalPath
        };
        postProcessReq && postProcessReq(clientReq, options);
        const proxyReq = http.request(options, (proxyRes) => {
            const { statusCode, headers } = proxyRes;
            if (statusCode !== 200) {
                console.error(path, statusCode);
                proxyRes.resume();
            }
            clientRes.writeHead(statusCode, headers);
            proxyRes.pipe(clientRes, { end: true });
        })
            .on('error', console.error);
        clientReq.pipe(proxyReq, { end: true });
    };
};
module.exports = proxy;
