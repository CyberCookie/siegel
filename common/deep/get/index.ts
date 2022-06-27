import isExists from '../../is/exists'


function deepGet(obj: Indexable, path: string[] | string, defaultVal?: any): any {
    const arrayPath = Array.isArray(path) ? path : [ path ]
    const deepLink = obj[arrayPath[0]]

    return isExists(deepLink)
        ?   arrayPath.length > 1
            ?   deepGet(deepLink, arrayPath.slice(1), defaultVal)
            :   deepLink
        :   defaultVal
}


export default deepGet