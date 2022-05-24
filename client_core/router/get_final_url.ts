function getFinalURL(curUrl: string, urlPart: string) {
    let result
    if (urlPart) {
        const firstCharUrlPart = urlPart[0]

        if (firstCharUrlPart == '!') {
            const newPathPart = urlPart.substring(1)

            const urlArray = curUrl.split('/')
            newPathPart
                ?   (urlArray[ urlArray.length - 1 ] = newPathPart)
                :   urlArray.pop()

            result = urlArray.join('/') || '/'

        } else {
            result = firstCharUrlPart == '/'
                ?   urlPart
                :   `${curUrl}/${urlPart}`
        }

    } else result = '/'


    const { basename } = history
    if (basename && !result.startsWith(basename)) {
        result = `${basename}${ result == '/' ? '' : result }`
    }


    return result
}


export default getFinalURL