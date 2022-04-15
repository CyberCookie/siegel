type Key = string | number


/**
 * Set object property by mutating it using given `path`
 * @param obj - object where to set a value
 * @param path - chain of links using to set a value into given `obj`
 * @param value - value to set
 */
function deepSet(iterable: any[] | Indexable, path: Key[] | Key, value: any): void {
    let link: Indexable = iterable
    const pathSequence = Array.isArray(path) ? path : [ path ]

    for (let i = 0, l = pathSequence.length; i < l; i++) {
        const pathPart = pathSequence[i]

        if (i == l - 1) {
            link[pathPart] = value
        } else {
            if (link[pathPart] === undefined) {
                link[pathPart] = typeof pathSequence[i + 1] == 'number' ? [] : {}
            }
            link = link[pathPart]
        }
    }
}


export default deepSet