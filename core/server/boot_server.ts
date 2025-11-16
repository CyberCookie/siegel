import httpServer, { Server } from './http.js'
import http2Server, { Http2Server } from './http2'

import type { ServerBootParams } from './types'


const server = {
    async run(params: ServerBootParams) {
        const { http2, host, port } = params.config.server!

        const server = http2
            ?   await http2Server(params)
            :   await httpServer(params)


        ;(server as Http2Server | Server)
            .on('error', console.error)


        const serverInstance = server.listen(port as number, host!, err => {
            err
                ?   console.error(err)
                :   console.info('Starting server on %s:%s.', host, port)
        })

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