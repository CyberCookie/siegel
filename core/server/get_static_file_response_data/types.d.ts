import type { ServerConfig } from '../types'


type HeaderValue = string | string[] | undefined

type GetStaticFileResponseParams = (
    params: {
        publicDir: string
        serveCompressionsPriority: ServerConfig['serveCompressionsPriority']
        reqUrl: NonNullable<HeaderValue>
        cacheControl: HeaderValue
        acceptEncoding: HeaderValue
    }
) => {
    pathToFile: string
    encoding: string
    contentType: string
    cacheControl: string
}


export type { GetStaticFileResponseParams, HeaderValue }