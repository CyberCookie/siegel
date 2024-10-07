import fs from 'fs'
import path from 'path'
import mime from 'mime'

import type { GetStaticFileResponseParams, HeaderValue } from './types'


const STRIP_PATH_TRAVERSAL_REGEXP = /^(\.\.(\/|\\|$))+/
const CHARSET_CONTENT_TYPES_REGEXP = /^text\/|^application\/(javascript|json)/


const finalizeHeaderValue = (value: NonNullable<HeaderValue>) => (
    value?.constructor == String
        ?   value
        :   `${value}`
)

const getStaticFileResponseParams: GetStaticFileResponseParams = params => {
    const {
        publicDir, reqUrl, serveCompressionsPriority,
        cacheControl = '',
        acceptEncoding = ''
    } = params


    const reqUrlFinal = finalizeHeaderValue(reqUrl)
    const urlNormalized = path.normalize(reqUrlFinal)
        .replace(STRIP_PATH_TRAVERSAL_REGEXP, '')


    const pathAbsolute = path.join(publicDir, urlNormalized)

    let contentType = mime.getType(pathAbsolute)
    if (contentType && CHARSET_CONTENT_TYPES_REGEXP.test(contentType)) {
        contentType += '; charset=UTF-8'
    }


    const acceptEncodingFinal = finalizeHeaderValue(acceptEncoding)
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