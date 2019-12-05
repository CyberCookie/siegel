type IndexableAny = Indexable | any[]

/**
 * Recursively makes clone of a given object
 * @param  {Object | *[]} obj - object to copy
 * @return {Object | *[]} copied object
 */
function deepClone(obj: IndexableAny): IndexableAny {
    if (!obj || typeof obj !== 'object') return obj;

    let result;
    if (obj.constructor === Array) {
        result = []

        for (var i = 0, l = obj.length; i < l; i++) {
            result[i] = deepClone(obj[i])
        }

        return result
    }

    result = {}
    for (let i in obj) {
        result[i] = deepClone(obj[i])
    }

    return result
}


export default deepClone