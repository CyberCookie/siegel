import path from 'node:path'

import { isEmptyObject } from 'siegel-utils'
import { extractSSL, runMiddleware, handleHmrStream, getStaticFileResponseData } from './utils'

import type { ServerBootParams } from './types'


function runServer(params: ServerBootParams) {
    const { config, devMiddlewares } = params
    const { publicDir, server, build } = config
    const { http3, host, port, appServer, ssl } = server!

    const htmlFileName = path.basename(build!.input!.html!)


    const serverOptions = {
        port, http3,
        hostname: host,
        tls: ssl ? extractSSL(ssl) : undefined,
        fetch: async (req, server) => {

            const { response } = await appServer?.(req, server) || {}
            if (response) return response
            else {

                const { method, url } = req
                if (method === 'GET') {
                    const { pathname } = new URL(url)


                    if (!isEmptyObject(devMiddlewares)) {
                        const { dev, hot, indexFallback } = devMiddlewares

                        if (pathname === '/__webpack_hmr') {
                            return handleHmrStream(hot, req, server)

                        } else {
                            const devResult = await runMiddleware(dev, req)
                            if (devResult.handled) return devResult.response!
                            else {

                                const fallbackResult = await runMiddleware(indexFallback, req)
                                if (fallbackResult.handled) return fallbackResult.response!
                            }
                        }
                    }


                    const safeFilePath = path.resolve(
                        path.join(publicDir!, pathname)
                    )
                    if (safeFilePath.startsWith(publicDir!)) {

                        const { file, headers } = getStaticFileResponseData({
                            serverConfig: server,
                            publicDir, htmlFileName, req
                        })

                        return new Response(file, { headers })

                    } return new Response('403 Forbidden', { status: 403 })

                } else return new Response('501 Not Implemented', { status: 501 })
            }
        }
    } satisfies Parameters<typeof Bun['serve']>[0]


    Bun.serve(serverOptions)
    console.info('Starting server on %s:%s.', host, port)
}


export default runServer
export * as serverUtils from './utils'