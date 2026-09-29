import { serverUtils, ServerExtenderFn } from 'siegel'

import type { EchoReqBody } from '../dto/demo_api'


const { proxyReq, matchRoute } = serverUtils


const proxyExample = proxyReq({
    host: 'jsonplaceholder.typicode.com',
    path: '/todos/:id',
    secure: true,
    changeOrigin: true
})

const appServer: ServerExtenderFn = async req => {
    const { method, body, url } = req
    const { pathname } = new URL(url)


    let response: Response | undefined
    if (method === 'POST') {
        if (pathname === '/api/echo') {
            const echoBody = await body!.json() as EchoReqBody
            response = Response.json(echoBody)
        }

    } else if (method === 'GET') {
        if (pathname.startsWith('/.well-known/') || pathname === '/favicon.ico') {
            response = new Response('Not Found', { status: 404 })

        } else if (pathname === '/api/hc') {
            response = new Response('OK', { status: 200 })

        } else response = await matchRoute(pathname, {
            '/api/proxy_get/:id': async resolvedParams => (
                proxyExample.handleFetch(req, resolvedParams)
            )
        })
    }


    return { response }
}


export default appServer