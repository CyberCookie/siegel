import type { ServerConfig } from '../types'


type Mime = typeof import('mime')


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
    contentType: ReturnType<Mime['lookup']>
    cacheControl: string
}


export type { GetStaticFileResponseParams, HeaderValue }