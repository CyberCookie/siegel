import fs from 'fs'
import path from 'path'
import mime from 'mime'

import type { GetStaticFileResponseParams, HeaderValue } from './types'


const STRIP_PATH_TRAVERSAL_REGEXP = /^(\.\.(\/|\\|$))+/

const finalizeHeaderValue = (value: NonNullable<HeaderValue>) => (
    value?.constructor == String
        ?   value
        :   value.toString()
)

const getStaticFileResponseParams: GetStaticFileResponseParams = params => {
    const {
        publicDir, reqUrl, serveCompressionsPriority,
        cacheControl = '',
        acceptEncoding = ''
    } = params


    const reqUrlFinal = finalizeHeaderValue(reqUrl)
    const acceptEncodingFinal = finalizeHeaderValue(acceptEncoding)


    const urlNormalized = path.normalize(reqUrlFinal)
        .replace(STRIP_PATH_TRAVERSAL_REGEXP, '')

    const pathAbsolute = path.join(publicDir, urlNormalized)

    let contentType = mime.lookup(pathAbsolute)

    const charset = mime.charsets.lookup(contentType, '')
    charset && (contentType += `; charset=${charset}`)


    const browserEncodings = new Set(
        (acceptEncodingFinal || '').split(', ')
    )

    let encoding = ''
    let pathToFile = pathAbsolute

    if (serveCompressionsPriority) {
        for (let i = 0, l = serveCompressionsPriority.length; i < l; i++) {
            const encodingPrefecence = serveCompressionsPriority[i]
            const compressedFilePath = `${pathAbsolute}.${encodingPrefecence}`

            if (browserEncodings.has(encodingPrefecence) && fs.existsSync(compressedFilePath)) {
                pathToFile = compressedFilePath
                encoding = encodingPrefecence
                break
            }
        }
    }


    return {
        pathToFile, encoding, contentType,
        cacheControl: urlNormalized.includes('index.html') || cacheControl.includes('no-cache')
            ?   ''
            :   'max-age=31536000, immutable'
    }
}


export default getStaticFileResponseParams