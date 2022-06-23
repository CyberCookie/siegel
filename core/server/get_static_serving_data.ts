import fs from 'fs'
import path from 'path'
import mime from 'mime'


const STRIP_PATH_TRAVERSAL_REGEXP = /^(\.\.(\/|\\|$))+/

function getFileResponseParams(params: any) {
    const {
        publicDir, reqUrl, serveCompressionsPriority,
        cacheControl = '',
        acceptEncoding = ''
    } = params

    const urlNormalized = path.normalize(reqUrl)
        .replace(STRIP_PATH_TRAVERSAL_REGEXP, '')

    const pathAbsolute = path.join(publicDir, urlNormalized)

    let contentType = mime.lookup(pathAbsolute)

    const charset = mime.charsets.lookup(contentType, '')
    charset && (contentType += `; charset=${charset}`)


    const browserEncodings = new Set(
        (acceptEncoding || '').split(', ')
    )

    let encoding = ''
    let pathToFile = pathAbsolute

    for (let i = 0, l = serveCompressionsPriority.length; i < l; i++) {
        const encodingPrefecence = serveCompressionsPriority[i]
        const compressedFilePath = `${pathAbsolute}.${encodingPrefecence}`

        if (browserEncodings.has(encodingPrefecence) && fs.existsSync(compressedFilePath)) {
            pathToFile = compressedFilePath
            encoding = encodingPrefecence
            break
        }
    }


    return {
        pathToFile, encoding, contentType,
        cacheControl: urlNormalized.includes('index.html') || cacheControl.includes('no-cache')
            ?   ''
            :   'max-age=31536000, immutable'
    }
}


export default getFileResponseParams