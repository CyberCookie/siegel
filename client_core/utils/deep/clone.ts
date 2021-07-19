type AnyObj = Record<string, unknown>
type AnyArray = Array<any>


/**
 * Clones an object iterating recursively over its keys
 * @param object to clone
 * @returns Clonned object
 */
function deepClone<T>(obj: T): T {
    if (typeof obj !== 'object') return obj

    let result: Indexable

    if ((obj as AnyObj).constructor.name == 'Array') {
        result = []
        for (let i = 0, l = ((obj as unknown) as AnyArray).length; i < l; i++) {
            result[i] = deepClone(
                ((obj as unknown) as AnyArray)[i]
            )
        }
    } else if ((obj as AnyObj).constructor.name == 'Object') {
        result = {}
        for (const i in obj) {
            result[i] = deepClone(obj[i])
        }
    } else result = new (obj as any).constructor(obj)


    return result as T
}


export default deepClone