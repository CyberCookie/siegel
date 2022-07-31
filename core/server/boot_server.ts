import httpServer from './http.js'
import http2Server from './http2'

import type { ServerBootParams } from './types'


const server = {
    async run(params: ServerBootParams) {
        const { http2, host, port } = params.CONFIG.server

        const server = http2
            ?   await http2Server(params)
            :   await httpServer(params)


        server.on('error', err => {
            console.error(err)
        })


        return server.listen(port, host, () => {
            console.info('Starting server on %s:%s.', host, port)
        })
    }
}


export default server