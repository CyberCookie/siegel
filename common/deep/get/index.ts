import isNullable from '../../is/nullable'


/**
 * To retrieve deeply nested value
 *
 * @param obj to get value from
 * @param path Path to desired value within object
 * @param defaultVal Value to return if no value by with provided path
 * @returns Seek value
 */
function deepGet(obj: any, path: string[] | string, defaultVal?: any): any {
    if (isNullable(obj)) return defaultVal

    const arrayPath = Array.isArray(path) ? path : [ path ]
    const deepLink = obj[arrayPath[0]]


    return arrayPath.length > 1
        ?   deepGet(deepLink, arrayPath.slice(1), defaultVal)
        :   deepLink
}


export default deepGet