import path from 'node:path'
import mime from 'mime'

import type { GetStaticFileResponseDataParams } from './types'


const CHARSET_CONTENT_TYPES_REGEXP = /^text\/|^application\/(javascript|json)/


const getStaticFileResponseData = (params: GetStaticFileResponseDataParams) => {
    const {
        req: { url, headers },
        htmlFileName, publicDir, serverConfig
    } = params


    const { pathname } = new URL(url)
    let fileToSendPath = path.join(
        publicDir!,
        path.extname(pathname)
            ?   pathname
            :   htmlFileName
    )


    let contentEncoding: string | undefined
    const { serveCompressionsPriority } = serverConfig!
    if (serveCompressionsPriority) {

        const acceptEncoding = headers.get('accept-encoding')
        if (acceptEncoding) {

            for (let i = 0, l = serveCompressionsPriority.length; i < l; i++) {
                const encodingPrefecence = serveCompressionsPriority[i]
                const compressedFilePath = fileToSendPath + '.' + encodingPrefecence

                if (
                        acceptEncoding.includes(encodingPrefecence)
                    &&  Bun.file(compressedFilePath).size
                ) {

                    fileToSendPath = compressedFilePath
                    contentEncoding = encodingPrefecence
                    break
                }
            }
        }
    }

    let contentType = mime.getType(fileToSendPath) || 'application/octet-stream'
    if (CHARSET_CONTENT_TYPES_REGEXP.test(contentType)) {
        contentType += '; charset=UTF-8'
    }


    return {
        file: Bun.file(fileToSendPath),
        headers: {
            'content-type': contentType,
            'cache-control': fileToSendPath.endsWith('.html')
                ?   'no-cache'
                :   'public, max-age=31536000, immutable',
            ...(contentEncoding ? {
                'content-encoding': contentEncoding
            } : {})
        }
    }
}


export default getStaticFileResponseData