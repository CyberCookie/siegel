import httpServer from './http.js'
import http2Server from './http2.js'


const server = {
    run: async params => {
        const { http2, host, port } = params.CONFIG.server

        const server = http2
            ?   await http2Server(params)
            :   await httpServer(params)


        return server.listen(port, host, err => {
            err
                ?   console.error(err)
                :   console.info('Starting server on %s:%s.', host, port)
        })
    }
}


export default server