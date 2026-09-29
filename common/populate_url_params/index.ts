/**
 * Replaces URL params with actual param values
 *
 * @param url - URL to populate
 * @param params - Object that represents params values where key is URL param key and value is param value
 * @returns Populated URL
 */
function populateURLParams(url: string, params: Obj) {
    for (let i = 0, keys = Object.keys(params), l = keys.length; i < l; i++) {
        const paramKey = keys[i]
        const paramValue = params[paramKey]

        url = url.replace(':' + paramKey, paramValue)
    }

    return url
}


export default populateURLParams