//TODO: implement clone of Set, RegExp, Date...

/**
 * Clones an object iterating recursively over its keys
 * @param object to clone
 * @returns Clonned object
 */
function deepClone<T>(obj: T): T {
    if (typeof obj !== 'object') return obj

    let result: Indexable
    if (Array.isArray(obj)) {
        result = []
        for (let i = 0, l = obj.length; i < l; i++) {
            result[i] = deepClone(obj[i])
        }

        return result as T
    }

    result = {}
    for (const i in obj) {
        result[i] = deepClone(obj[i])
    }

    return result as T
}


export default deepClone