import { isEmptyObject, populateURLParams } from 'siegel-utils'

import type { ProxyParams } from './types'


function getProxyPathAndSearchQuery(
    proxyParams: ProxyParams,
    req: Request,
    routeParams: Obj<string>
) {

    const { path, query } = proxyParams
    const { url } = req

    let indexOfQuery: number | undefined
    let targetPath = path
    if (!targetPath) {
        const indexOfPathStart = url.indexOf('/', url.indexOf('//') + 2)
        indexOfQuery = url.indexOf('?', indexOfPathStart)

        targetPath = indexOfQuery === -1
            ?   url.slice(indexOfPathStart)
            :   url.slice(indexOfPathStart, indexOfQuery)
    }

    let targetQuery = ''
    if (query && !isEmptyObject(query)) {
        targetQuery = '?' + String(new URLSearchParams(query as Obj))

    } else {
        const queryIdx = indexOfQuery ?? url.indexOf('?')
        queryIdx !== -1 && (targetQuery = url.slice(queryIdx))
    }

    if (!isEmptyObject(routeParams)) {
        targetPath = populateURLParams(targetPath, routeParams)
    }


    return { targetPath, targetQuery }
}

const proxyReq = (proxyParams: ProxyParams) => {
    const { changeOrigin, ws, wsEndpoints, host, port, secure, postProcessReq } = proxyParams

    const wsEndpointsSet = wsEndpoints ? new Set(wsEndpoints) : null

    const protocol = secure ? 'https:' : 'http:'
    const portFinal = port ? (':' + port) : ''
    const hostHeaderValue = host + portFinal
    const targetOrigin = `${protocol}//${hostHeaderValue}`


    return {
        /**
         * Intercepts and matches WebSocket upgrade queries natively inside Bun.serve
         */
        shouldUpgradeWS({ headers, url }: Request): boolean {
            if (!ws || headers.get('upgrade')?.toLowerCase() !== 'websocket') return false
            if (!wsEndpointsSet) return true

            const { pathname } = new URL(url)
            return wsEndpointsSet.has(pathname)
        },

        async handleFetch(req: Request, routeParams: Obj<string>): Promise<Response> {
            const { method, headers, body, url } = req


            const targetHeaders = new Headers(headers)
            changeOrigin && targetHeaders.set('host', hostHeaderValue)

            const proxyReqOpts: BunFetchRequestInit = {
                headers: targetHeaders,
                body: (method === 'GET' || method === 'HEAD') ? null : body,
                redirect: 'manual',
                decompress: false,
                method
            }

            const { targetPath, targetQuery } = getProxyPathAndSearchQuery(proxyParams, req, routeParams)
            const targetUrl = targetOrigin + targetPath + targetQuery
            const targetUrlFinal = postProcessReq?.(targetUrl, proxyReqOpts) || targetUrl


            try {
                const response = await fetch(targetUrlFinal, proxyReqOpts)
                if (response.status !== 200) {
                    console.error(`[Proxy Target Alert] ${url} -> Status ${response.status}`)
                }

                return response

            } catch (err) {
                console.error('[Proxy Error]:', err)
                return new Response('Bad Gateway', { status: 502 })
            }
        }
    }
}


export default proxyReq