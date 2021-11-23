import type { Request, Response, Application, Express, NextFunction } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'

import type { EchoReqBody } from '../dto/demo_api'


type Handler<ReqBody, ResBody> = (
    req: {
        body: ReqBody
    } & Omit<Request<ParamsDictionary, ResBody, ReqBody>, 'body'>,
    res: Response<ResBody>,
    next: NextFunction
) => void



const { proxyReq } = require('./siegel_lib')


module.exports = (app: Application, { express }: { express: Express }) => {
    app
        .use((express as any).json())

        .post('/api/echo', ((req, res) => {
            res.send(req.body)
        }) as Handler<EchoReqBody, EchoReqBody>)

        .get('/api/proxy_get/:id', proxyReq({
            host: 'jsonplaceholder.typicode.com',
            path: '/todos/:id',
            changeOrigin: true
        }))
}
export { }