/**
 * Set object property by given path
 * @param  {Object} obj - object where to set a value
 * @param  {Array<number | string> | string | number} path - chain of links using to set a value into given `obj`
 * @param  {*} value - value to set
 * @return {Object} modified `obj`
 */
function deepSet(obj: IndexingObject, path: Indexer[] | Indexer, value: any): IndexingObject {
    let link = obj;
    let pathSequence = Array.isArray(path) ? path : [path]

    for (var i = 0, l = pathSequence.length; i < l; i++) {
        let pathPart = pathSequence[i]

        if (i == pathSequence.length - 1) {
            link[pathPart] = value
        } else {
            let deepLink = link[pathPart]
            deepLink === undefined && (link[pathPart] = {})
            link = deepLink
        }
    }

    return obj
}


export default deepSet