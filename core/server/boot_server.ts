import fastify from 'fastify'

import type { ServerBootParams, FastifyHTTPServer, FastifyHTTP2Server } from './types'


const server = {
    async run(params: ServerBootParams) {
        const { devMiddlewares, config } = params
        const { http2, host, port, appServer } = config.server!

        let server: FastifyHTTP2Server | FastifyHTTPServer
        if (http2) {
            server = fastify({ http2: true })

        } else {
            server = fastify() as FastifyHTTPServer

            const { dev, hot, indexFallback } = devMiddlewares
            server.addHook('onRequest', (req, res, next) => {
                const rawReq = req.raw
                const rawRes = res.raw

                indexFallback(rawReq, rawRes, () => {

                    dev(rawReq, rawRes, err => {
                        if (err) return next(err)

                        else hot(rawReq, rawRes, err => err ? next(err) : next())
                    })
                })
            })
        }

        appServer && await appServer(server, config, fastify)

        const serverInstance = await server.listen({
            port: +port!,
            host
        })
        // const server = http2
        //     ?   await http2Server(params)
        //     :   await httpServer(params)


        // ;(server as Http2Server | Server)
        //     .on('error', console.error)


        // const serverInstance = server.listen(port as number, host!, err => {
        //     err
        //         ?   console.error(err)
        //         :   console.info('Starting server on %s:%s.', host, port)
        // })

        // process.on('SIGTERM', () => {
        //     serverInstance.close()
        // })
        // process.on('SIGINT', () => {
        //     serverInstance.close()
        // })


        return serverInstance
    }
}


export default server