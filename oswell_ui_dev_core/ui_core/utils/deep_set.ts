/**
 * Set object property by mutating it using given `path`
 * @param obj - object where to set a value
 * @param path - chain of links using to set a value into given `obj`
 * @param value - value to set
 */
function deepSet(obj: Indexable, path: string[] | string, value: any): void {
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
}


export default deepSet