const SLASH = '/'

function getFinalURL(curUrl: string, urlPart: string) {
    let result
    if (urlPart) {
        const firstCharUrlPart = urlPart[0]

        if (firstCharUrlPart == '!') {
            const newPathPart = urlPart.substring(1)

            const urlArray = curUrl.split(SLASH)
            newPathPart
                ?   (urlArray[ urlArray.length - 1 ] = newPathPart)
                :   urlArray.pop()

            result = urlArray.join(SLASH) || SLASH

        } else {
            result = firstCharUrlPart == SLASH
                ?   urlPart
                :   `${curUrl}${SLASH}${urlPart}`
        }

    } else result = SLASH


    const { basename } = history
    if (basename && !result.startsWith(basename)) {
        result = `${basename}${ result == SLASH ? '' : result }`
    }


    return result
}


export default getFinalURL