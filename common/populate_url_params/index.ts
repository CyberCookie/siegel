function populateURLParams(url: string, params: Obj<string>) {
    for (const param in params) {
        url = url.replace(`:${param}`, params[param])
    }

    return url
}


export default populateURLParams