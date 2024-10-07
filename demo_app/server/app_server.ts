import { proxyReq, ServerExtenderFn } from '../../core'

import type { Request, Response, NextFunction } from 'express'
import type { EchoReqBody } from '../dto/demo_api'


type ReqHandler<ReqBody, ResBody> = (
    req: {
        body: ReqBody
    } & Omit<Request<object, ResBody, ReqBody>, 'body'>,
    res: Response<ResBody>,
    next: NextFunction
) => void


const appServer: ServerExtenderFn = params => {
    const { express, onStream, staticServer } = params

    if (onStream) { // if HTTP2
        onStream(() => {
            console.log('HTTP2 stream')
        })

    } else {
        staticServer
            .use(express.json())

            .post('/api/echo', ((req, res) => {
                res.send(req.body)
            }) as ReqHandler<EchoReqBody, EchoReqBody>)

            .get('/api/proxy_get/:id', proxyReq({
                host: 'jsonplaceholder.typicode.com',
                path: '/todos/:id',
                changeOrigin: true
            }))

            .get('/api/hc', (_, res) => {
                res.sendStatus(200)
            })
    }
}


export default appServer