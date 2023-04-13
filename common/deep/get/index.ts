import isNullable from '../../is/nullable'


/**
 * To retrieve deeply nested value
 *
 * @param obj to get value from
 * @param path Path to desired value within object
 * @param defaultVal Value to return if no value by with provided path
 * @returns Seek value
 */
function deepGet<
    _Obj extends Obj,
    _Keys extends PathsOf<_Obj>
>(obj: _Obj, path: _Keys, defaultVal?: any): any {

    if (isNullable(obj)) return defaultVal

    const arrayPath = path
    const deepLink = obj[arrayPath[0]]


    return arrayPath.length > 1
        ?   deepGet(deepLink, arrayPath.slice(1) as PathsOf<typeof deepLink>, defaultVal)
        :   deepLink
}


export default deepGet