// const https = require('https'),
//     fs = require('fs');
// https
//     .createServer({
//         key: fs.readFileSync(path.join(process.cwd(), 'server', 'cert', 'key.pem')),
//         cert: fs.readFileSync(path.join(process.cwd(), 'server', 'cert', 'certificate.pem'))
//         // pfx: fs.readFileSync(path.join(process.cwd(), 'server', 'cert', './certificate.p12')), 
//         // passphrase: 'secret'
//     }, app)
//     .listen(serverConfig.nodePort, serverConfig.nodeHost, err => {
//         err
//             ? console.error(err)
//             : console.info('Starting server on %s:%s.', serverConfig.nodeHost, serverConfig.nodePort) 
//     })
const http = require('http')
const querystring = require('querystring')
const express = require('express')
const compression = require('compression')
// const compression = require('express-static-gzip')
const historyApiFallback = require('connect-history-api-fallback')
const config = require('./config')

const { nodeHost, nodePort, proxyHost, proxyPort } = config.server;
const app = express()


const proxy = (port = proxyPort, host = proxyHost) => (clientReq, clientRes) => {
    const { path, method, headers, query } = clientReq;

    const options = {
        method, headers, host, port,
        path: Object.keys(query).length
            ?   `${path}?${querystring.stringify(query)}`
            :   path
    }


    const proxyReq = http.request(options, proxyRes => {
        if (proxyRes.statusCode !== 200) {
            console.error(path, proxyRes.statusCode)
            proxyRes.resume()
        }
        
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers)

        proxyRes.pipe(clientRes, { end: true })
    })
    .on('error', console.error)


    clientReq.pipe(proxyReq, { end: true })
}


module.exports = {
    run: (middlewares = []) => {
        app.disable('x-powered-by')        
        app.use(historyApiFallback())
        app.use(compression())
        app.use(express.json())

        middlewares.forEach(m => app.use(m))

        app.use(express.static( config.build.output.loc ))
        // app.use('/', compression(config.build.output.loc, { enableBrotli: true }))

        
        return app.listen(nodePort, nodeHost, err => {
            err
                ?   console.error(err)
                :   console.info('Starting server on %s:%s.', nodeHost, nodePort) 
        })
    }
}