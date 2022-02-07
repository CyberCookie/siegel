import fs from 'fs'


const listen = (server, host, port) => (
    server.listen(port, host, err => {
        err
            ?   console.error(err)
            :   console.info('Starting server on %s:%s.', host, port)
    })
)

const extractSSL = ({ keyPath, certPath }) => ({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
})


async function createHTTPServer(CONFIG, middlewares, serverExtend) {
    const express = (await import('express')).default
    const expressStatic = (await import('express-static-gzip')).default
    const historyApiFallback = (await import('connect-history-api-fallback')).default


    const { staticDir, server: serverConfig } = CONFIG
    const { host, port, ssl } = serverConfig


    const expressApp = express()
    serverExtend && await serverExtend(expressApp, { express })

    expressApp
        .disable('x-powered-by')
        .use(historyApiFallback())
        .use('/', expressStatic(staticDir, {
            enableBrotli: true,
            orderPreference: ['br', 'gzip']
        }))

    middlewares.forEach(m => { expressApp.use(m) })


    let server = expressApp
    if (ssl) {
        const { createServer } = await import('https')
        server = createServer(extractSSL(ssl), expressApp)
    }


    return listen(server, host, port)
}


async function createHTTP2Server(CONFIG, serverExtend) {
    const http2 = await import('http2')
    const path = await import('path')
    const mime = (await import('mime-types')).default


    const { staticDir, server: serverConfig } = CONFIG
    const { host, port, ssl } = serverConfig


    const {
        HTTP2_HEADER_CONTENT_ENCODING,
        HTTP2_CONTENT_TYPE_KEY,
        HTTP2_HEADER_PATH,
        HTTP2_HEADER_STATUS
    } = http2.constants


    const server = ssl
        ?   http2.createSecureServer(extractSSL(ssl))
        :   http2.createServer()


    let onStreamCb
    serverExtend && await serverExtend(server, {
        mime,
        onStream(cb) {
            onStreamCb = cb
        }
    })


    server.on('error', console.error)

    server.on('stream', (stream, headers, flags) => {
        const reqFilePath = headers[HTTP2_HEADER_PATH]

        const isRoot = reqFilePath == '/'
        const isResourceRequested = reqFilePath.includes('.')
        if (isRoot || isResourceRequested) {
            handleRequestedFile({ reqFilePath, isRoot, stream })
        } else onStreamCb?.(stream, headers, flags)
    })


    function handleRequestedFile({ reqFilePath, isRoot, stream }) {
        const { ext, name, dir } = isRoot
            ?   {
                    dir: '/',
                    name: 'index',
                    ext: '.html'
                }
            :   path.parse(reqFilePath)

        const reponseHeaders = {
            [HTTP2_CONTENT_TYPE_KEY]: mime.contentType(ext)
        }

        let filePathNoExt = path.join(staticDir, dir, name)

        const encodingOrder = ['br', 'gzip']
        let pathToCompressedFile

        for (let i = 0, l = encodingOrder.length; i < l; i++) {
            const encoding = encodingOrder[i]
            const fileName = `${filePathNoExt}.${encoding}`

            if (fs.existsSync(fileName)) {
                pathToCompressedFile = fileName
                reponseHeaders[HTTP2_HEADER_CONTENT_ENCODING] = encoding
                break
            }
        }


        const finalFileName = pathToCompressedFile || (filePathNoExt += ext)

        stream.respondWithFile(finalFileName, reponseHeaders, {
            onError(err) {
                stream.respond({
                    [HTTP2_HEADER_STATUS]: err.code == 'ENOENT' ? 404 : 500
                })

                stream.end()
            }
        })
    }


    return listen(server, host, port)
}


const server = {
    run(CONFIG, middlewares = [], serverExtend) {
        return CONFIG.server.http2
            ?   createHTTP2Server(CONFIG, serverExtend)
            :   createHTTPServer(CONFIG, middlewares, serverExtend)
    }
}


export default server