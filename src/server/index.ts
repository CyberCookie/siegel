const fs = require('fs')


const listen = (server: any, host: any, port: any) => (
    server.listen(port, host, (err: any) => {
        err
            ?   console.error(err)
            :   console.info('Starting server on %s:%s.', host, port)
    })
)

const extractSSL = (ssl: any) => ({
    key: fs.readFileSync(ssl.keyPath),
    cert: fs.readFileSync(ssl.certPath)
})


function createHTTPServer(CONFIG: any, middlewares: any, serverExtend: any) {
    const { staticDir, server: serverConfig } = CONFIG
    const { host, port, ssl } = serverConfig

    const express = require('express')
    const expressApp = express()

    const expressStatic = require('express-static-gzip')
    const historyApiFallback = require('connect-history-api-fallback')


    serverExtend && serverExtend(expressApp, { express })


    expressApp
        .disable('x-powered-by')
        .use(historyApiFallback())
        .use('/', expressStatic(staticDir, {
            enableBrotli: true,
            orderPreference: ['br', 'gzip']
        }))
    middlewares.forEach((m: any) => { expressApp.use(m) })


    let server = expressApp
    if (ssl) {
        const { createServer } = require('https')
        server = createServer(extractSSL(ssl), expressApp)
    }


    return listen(server, host, port)
}


function createHTTP2Server(CONFIG: any, serverExtend: any) {
    const { staticDir, server: serverConfig } = CONFIG
    const { host, port, ssl } = serverConfig

    const http2 = require('http2')
    const mime = require('mime-types')
    const path = require('path')

    const {
        HTTP2_HEADER_CONTENT_ENCODING,
        HTTP2_CONTENT_TYPE_KEY,
        HTTP2_HEADER_PATH,
        HTTP2_HEADER_STATUS
    } = http2.constants


    const server = ssl
        ?   http2.createSecureServer(extractSSL(ssl))
        :   http2.createServer()


    serverExtend && serverExtend(server, { mime })


    server.on('error', console.error)
    server.on('stream', onStream)


    function onStream(stream: any, headers: any) {
        const reqFilePath = headers[HTTP2_HEADER_PATH]
        const ext = path.extname(reqFilePath)
        let filePath = path.join(staticDir, ext ? reqFilePath : 'index.html')

        const reponseHeaders = {
            [HTTP2_CONTENT_TYPE_KEY]: mime.contentType(path.extname(filePath))
        }


        const encodingOrder = ['br', 'gzip']
        for (let i = 0, l = encodingOrder.length; i < l; i++) {
            const encoding = encodingOrder[i]

            if (fs.existsSync(`${filePath},${encoding}`)) {
                filePath += `.${encoding}`
                reponseHeaders[HTTP2_HEADER_CONTENT_ENCODING] = encoding
                break
            }
        }


        function onError(err: any) {
            stream.respond({
                [HTTP2_HEADER_STATUS]: err.code == 'ENOENT' ? 404 : 500
            })

            stream.end()
        }


        stream.respondWithFile(filePath, reponseHeaders, { onError })
    }



    return listen(server, host, port)
}



module.exports = {
    run(CONFIG: any, middlewares = [], serverExtend: any) {
        return CONFIG.server.http2
            ?   createHTTP2Server(CONFIG, serverExtend)
            :   createHTTPServer(CONFIG, middlewares, serverExtend)
    }
}
export {}