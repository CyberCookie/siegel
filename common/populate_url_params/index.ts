/**
 * Replaces URL params with actual param values
 *
 * @param url URL to populate
 * @param params Object that represents params values where key is URL param key and value is param value
 * @returns Populated URL
 */
function populateURLParams(url: string, params: Obj<string>) {
    for (const param in params) {
        url = url.replace(`:${param}`, params[param]!)
    }

    return url
}


export default populateURLParams