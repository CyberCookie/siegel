"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const querystring = require('querystring');
const proxy = (port, host) => (clientReq, clientRes) => {
    const { path, method, headers, query } = clientReq;
    const options = {
        method, headers, host, port,
        path: Object.keys(query).length
            ? `${path}?${querystring.stringify(query)}`
            : path
    };
    const proxyReq = http.request(options, (proxyRes) => {
        if (proxyRes.statusCode !== 200) {
            console.error(path, proxyRes.statusCode);
            proxyRes.resume();
        }
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(clientRes, { end: true });
    })
        .on('error', console.error);
    clientReq.pipe(proxyReq, { end: true });
};
module.exports = proxy;
