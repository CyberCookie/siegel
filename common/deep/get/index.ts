import isNullable from '../../is/nullable'


function deepGet(obj: any, path: string[] | string, defaultVal?: any): any {
    if (isNullable(obj)) return defaultVal

    const arrayPath = Array.isArray(path) ? path : [ path ]
    const deepLink = obj[arrayPath[0]]


    return arrayPath.length > 1
        ?   deepGet(deepLink, arrayPath.slice(1), defaultVal)
        :   deepLink
}


export default deepGet