/**
 * Get object property by a given path
 * @param obj - object where to find a value
 * @param path - chain of links to get seeking value in given `obj`
 * @param defaultValue - value to be returned if `path` cannot be resolved in given `obj`
 * @returns value resolved by given `path` or `defaultValue`
 */
function deepGet(obj: Indexable, path: string[] | string, defaultVal?: any): any {
    let arrayPath = Array.isArray(path) ? path : [path]
    let deepLink = obj[arrayPath[0]]

    return obj && deepLink !== undefined
        ?   arrayPath.length > 1
            ?   deepGet(deepLink, arrayPath.slice(1), defaultVal)
            :   deepLink
        :   defaultVal
}


export default deepGet