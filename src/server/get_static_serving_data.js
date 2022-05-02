import fs from 'fs'
import path from 'path'
import mime from 'mime'


const STRIP_PATH_TRAVERSAL_REGEXP = /^(\.\.(\/|\\|$))+/

function getFileResponseParams(publicDir, url, headers, encodingOrder) {
    const urlNormalized = path.normalize(url)
        .replace(STRIP_PATH_TRAVERSAL_REGEXP, '')

    const pathAbsolute = path.join(
        publicDir,
        urlNormalized.includes('.') ? urlNormalized : '/index.html'
    )

    let contentType = mime.lookup(pathAbsolute)

    const charset = mime.charsets.lookup(contentType)
    charset && (contentType += `; charset=${charset}`)


    const browserEncodings = new Set(
        (headers['accept-encoding'] || '').split(', ')
    )

    let encoding = ''
    let pathToFile = pathAbsolute

    for (let i = 0, l = encodingOrder.length; i < l; i++) {
        const encodingPrefecence = encodingOrder[i]
        const compressedFilePath = `${pathAbsolute}.${encodingPrefecence}`

        if (browserEncodings.has(encodingPrefecence) && fs.existsSync(compressedFilePath)) {
            pathToFile = compressedFilePath
            encoding = encodingPrefecence
            break
        }
    }


    return { pathToFile, encoding, contentType }
}


export default getFileResponseParams