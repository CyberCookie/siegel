import isPrimitive from '../../is/primitive'


/**
 * Performs a deep clone of a given value
 * @param value to clone
 * @returns Clonned value
 */
function deepClone<T>(value: T): T {
    if (isPrimitive(value as unknown as object)) return value

    let result: Indexable

    if (Array.isArray(value)) {
        result = []
        for (let i = 0, l = value.length; i < l; i++) {
            result[i] = deepClone(value[i])
        }
    } else if ((value as Record<string, unknown>).constructor === Object) {
        result = {}
        for (const i in value) {
            result[i] = deepClone(value[i])
        }
    } else result = new (value as any).constructor(value)


    return result as T
}


export default deepClone