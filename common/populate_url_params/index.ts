/**
 * Replaces URL params with actual param values
 *
 * @param url URL to populate
 * @param params Object that represents params values where key is URL param key and value is param value
 * @returns Populated URL
 */
function populateURLParams(url: string, params: Obj) {
    Object.entries(params)
        .forEach(([ paramKey, paramValue ]) => {
            url = url.replace(`:${paramKey}`, paramValue)
        })

    return url
}


export default populateURLParams