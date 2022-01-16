function populateURLParams(url, params) {
    for (const param in params) {
        url = url.replace(`:${param}`, params[param])
    }

    return url
}


export default populateURLParams