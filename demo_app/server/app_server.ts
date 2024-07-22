import path from 'path'
import protobuf from 'protobufjs'
import { proxyReq, ServerExtenderFn } from '../../core'

import type { Request, Response, NextFunction } from 'express'
import type { EchoReqBody } from '../dto/demo_api'


const testProtoRoot = protobuf.loadSync(
    path.join(process.cwd(), 'demo_app', 'dto', 'test.proto')
)

const testMsgProto = testProtoRoot.lookupType('somePackage.SomeMessage')

const testPayload = {
    testField: 'qwerty'
}
// const verifyErrMsg = testMsgProto.verify(testPayload)
// if (verifyErrMsg) console.log(verifyErrMsg)


const resMsg = testMsgProto.encode(
    testMsgProto.create(testPayload)
).finish()
console.log('encoded: ', resMsg)

// const origMessage = testMsgProto.decode(resMsg)
// console.log('origMessage: ', origMessage)

type ReqHandler<ReqBody, ResBody> = (
    req: {
        body: ReqBody
    } & Omit<Request<{}, ResBody, ReqBody>, 'body'>,
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

            .post('/api/protobuf_req', (req, res) => {
                const body: Buffer[] = []
                req
                    .on('data', chunk => { body.push(chunk) })
                    .on('end', () => {
                        const data = Buffer.concat(body)
                        console.log(testMsgProto.decode(new Uint8Array(data)))
                    })

                res.send(resMsg)
            })
    }
}


export default appServer