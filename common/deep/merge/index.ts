import isExists from '../../is/exists'


const resolveAsUndefSymbol = Symbol('undef')

/**
 * Recursively merges objects
 *
 * @param obj_a - Object to merge
 * @param obj_b - Object to merge
 * @param options - Merge strategies options
 * @returns Merged objects
 */
const deepMerge = <
    T extends Obj,
    K extends Obj
>(
    obj_a: T,
    obj_b: K,
    options?: {
        mergeResolve?(obj_a: Obj, obj_b: Obj, propName: string): any
        resolveObject?(obj_a: Obj, obj_b: Obj, propName: string): Obj | symbol | undefined
    }
) => {

    const { mergeResolve, resolveObject } = options || {}
    const result: Obj = {}

    Object.entries(obj_a)
        .forEach(([ a_key, a_value ]) => {

            if (Object.prototype.hasOwnProperty.call(obj_b, a_key)) {
                const b_value = obj_b[a_key]

                if (typeof a_value == 'object' && typeof b_value == 'object') {
                    if (a_value?.constructor == Object && b_value?.constructor == Object) {
                        const resolvedObj = resolveObject?.(a_value, b_value, a_key)
                        result[a_key] = isExists(resolvedObj)
                            ?   resolvedObj == resolveAsUndefSymbol
                                ?   undefined
                                :   resolvedObj
                            :   deepMerge(a_value, b_value, options)

                    } else {
                        result[a_key] = mergeResolve
                            ?   mergeResolve(a_value, b_value, a_key)
                            :   b_value
                    }

                } else result[a_key] = b_value
            } else result[a_key] = a_value
        })

    Object.entries(obj_b)
        .forEach(([ b_key, b_value ]) => {
            if (!Object.prototype.hasOwnProperty.call(obj_a, b_key)) {
                result[b_key] = b_value
            }
        })


    return result as T & K
}


export default deepMerge
export { resolveAsUndefSymbol }