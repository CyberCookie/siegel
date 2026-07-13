import path from 'path'
import fs from 'fs'
import fastify from 'fastify'

import extractSSL from './extract_ssl_key'
import getStaticFileResponseParams from './get_static_file_response_data'

import type {
    ServerBootParams,
    FastifyAllServerOptions, FastifyHTTPSOptions, FastifyHTTP2Options, FastifyHTTP2SOptions
} from './types'


const server = {
    async run(params: ServerBootParams) {
        const { config, devMiddlewares } = params
        const { publicDir, runMode, server, build } = config
        const { isBuild } = runMode!
        const { http2, host, port, appServer, serveCompressionsPriority, ssl } = server!


        const serverOptions: FastifyAllServerOptions = {}
        ssl && ((serverOptions as FastifyHTTPSOptions | FastifyHTTP2SOptions).https = extractSSL(ssl))
        http2 && ((serverOptions as FastifyHTTP2Options | FastifyHTTP2SOptions).http2 = true)

        const fastifyServer = fastify(serverOptions)


        if (isBuild) {
            const { dev, hot, indexFallback } = devMiddlewares
            fastifyServer.addHook('onRequest', (req, res, next) => {
                const rawReq = req.raw
                const rawRes = res.raw

                indexFallback(rawReq, rawRes, () => {
                    dev(rawReq, rawRes, err => {
                        err
                            ?   next(err)
                            :   hot(rawReq, rawRes, next)
                    })
                })
            })

        } else {
            fastifyServer.addHook('onRequest', (req, res, next) => {
                const { method, headers, url, protocol, host } = req

                if (method === 'GET') {
                    const isResourceResolved = server!.handleResourceRequest?.(req, res)

                    if (!isResourceResolved) {
                        if (headers.accept?.includes('text/html')) {
                            const filePath = path.join(
                                publicDir!,
                                path.basename(build!.input!.html!)
                            )
                            const stream = fs.createReadStream(filePath)

                            res.type('text/html')
                            res.send(stream)

                        } else {
                            const { pathname } = new URL(`${protocol}://${host}${url}`)
                            if (pathname.includes('.')) {
                                const {
                                    pathToFile, cacheControl, contentType, encoding
                                } = getStaticFileResponseParams({
                                        serveCompressionsPriority,
                                        publicDir: publicDir!,
                                        reqUrl: req.url,
                                        acceptEncoding: headers['accept-encoding']?.toString(),
                                        cacheControl: headers['cache-control']
                                    })

                                encoding && res.header('content-encoding', encoding)
                                contentType && res.header('content-type', contentType)
                                cacheControl && res.header('cache-control', cacheControl)

                                const stream = fs.createReadStream(pathToFile)
                                res.send(stream)

                            } else next()
                        }
                    }

                } else next()
            })
        }

        appServer && await appServer(fastifyServer, config, fastify)

        const serverInstance = fastifyServer.listen({
            port: +port!,
            host
        }, err => {
            err
                ?   process.exit(1)
                :   console.info('Starting server on %s:%s.', host, port)
        })


        return serverInstance
    }

    // run(params: ServerBootParams) {
    //     const { config, devMiddlewares } = params
    //     const { publicDir, runMode, server, build } = config
    //     const { isBuild } = runMode!
    //     const { http3, host, port, appServer, serveCompressionsPriority, ssl } = server!


    //     const serverOptions: Parameters<typeof Bun['serve']>[0] = {
    //         port, http3,
    //         hostname: host,
    //         fetch(req) {
    //             return new Response('404')
    //         }
    //     }

    //     ssl && (serverOptions.tls = extractSSL(ssl))



    //     Bun.serve(serverOptions)
    //     console.info('Starting server on %s:%s.', host, port)
    // }
}


export default server