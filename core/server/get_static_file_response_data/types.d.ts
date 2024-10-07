import type { ServerConfig } from '../types'
import type { Mime } from 'mime'


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
    contentType: ReturnType<Mime['getType']>
    cacheControl: string
}


export type { GetStaticFileResponseParams, HeaderValue }