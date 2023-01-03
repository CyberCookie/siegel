import isExists from '../../is/exists'


type Key = string | number


/**
 * To set property deeply into an object
 *
 * @param iterable Object to set value to
 * @param path Path to to set value by
 * @param value Value to set by provided path
 */
function deepSet(iterable: any[] | Obj, path: Key[] | Key, value: any): void {
    let link: Obj = iterable
    const pathSequence = Array.isArray(path) ? path : [ path ]

    for (let i = 0, l = pathSequence.length; i < l; i++) {
        const pathPart = pathSequence[i]

        if (i == l - 1) {
            link[pathPart] = value
        } else {
            if (!isExists(link[pathPart])) {
                link[pathPart] = typeof pathSequence[i + 1] == 'number' ? [] : {}
            }

            link = link[pathPart]
        }
    }
}


export default deepSet