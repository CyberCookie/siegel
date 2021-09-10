/**
 * Clones an object iterating recursively over its keys
 * @param object to clone
 * @returns Clonned object
 */
function deepClone<T>(obj: T): T {
    if (typeof obj !== 'object') return obj

    let result: Indexable

    if (obj instanceof Array) {
        result = []
        for (let i = 0, l = obj.length; i < l; i++) {
            result[i] = deepClone(
                obj[i]
            )
        }
    } else if ((obj as Record<string, unknown>).constructor.name == 'Object') {
        result = {}
        for (const i in obj) {
            result[i] = deepClone(obj[i])
        }
    } else result = new (obj as any).constructor(obj)


    return result as T
}


export default deepClone