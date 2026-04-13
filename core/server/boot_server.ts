// import httpServer, { Server } from './http.js'
// import http2Server, { Http2Server } from './http2'
import fastify, { FastifyInstance } from 'fastify'

import type { Server } from 'http'
import type { Http2Server } from 'http2'
import type { ServerBootParams } from './types'


type FastifyHTTPServer = FastifyInstance<Server>
type FastifyHTTP2Server = FastifyInstance<Http2Server>


const server = {
    async run(params: ServerBootParams) {
        const { devMiddlewares } = params
        const { http2, host, port } = params.config.server!

        let server: FastifyHTTP2Server | FastifyHTTPServer
        if (http2) {
            server = fastify({ http2: true })

        } else {
            server = fastify() as FastifyHTTPServer

            server.get('*', {}, (req, res) => {

                devMiddlewares[0](req.raw, res.raw, () => {})

                devMiddlewares[1](req.raw, res.raw, () => {})

                devMiddlewares[2](req.raw, res.raw, () => {})
            })
        }

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