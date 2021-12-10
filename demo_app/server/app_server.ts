import type { Http2Server, Http2SecureServer, ServerHttp2Stream, IncomingHttpHeaders } from 'node:http2'
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

type App = Application | Http2Server | Http2SecureServer

type InternalAPI = {
    express?: Express
    mime?: any
    onStream?: (
        cb: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void
    ) => void
}


const { proxyReq } = require('./siegel_lib')

module.exports = (app: App, { express, onStream }: InternalAPI) => {
    if (onStream) { // if HTTP2
        onStream(() => {
            console.log('HTTP2 stream')
        })

    } else {
        (app as Application)
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
}
export {}