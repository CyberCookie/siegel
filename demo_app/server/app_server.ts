import { serverUtils, ServerExtenderFn, FastifyHTTPServer } from '../../core'

import type { FastifyRequest } from 'fastify'
import type { EchoReqBody } from '../dto/demo_api'


const appServer: ServerExtenderFn = server => {
    ;(server as FastifyHTTPServer)
        .post('/api/echo', (req: FastifyRequest<{ Body: EchoReqBody }>, res) => {
            res.send(req.body)
        })

        .get('/api/proxy_get/:id', serverUtils.proxyReq({
            host: 'jsonplaceholder.typicode.com',
            path: '/todos/:id',
            changeOrigin: true
        }))

        .get('/api/hc', (_, res) => {
            res.code(200)
        })
}


export default appServer