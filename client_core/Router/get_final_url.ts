function getFinalURL(curUrl: string, urlPart: string) {
    if (!urlPart) return '/'


    const firstCharUrlPart = urlPart[0]

    if (firstCharUrlPart == '/') return urlPart

    else if (firstCharUrlPart == '!') {
        const urlArray = curUrl.split('/')
        urlArray[ urlArray.length - 1 ] = urlPart.substring(1)
        return urlArray.join('/')

    } else return `${curUrl}/${urlPart}`
}


export default getFinalURL