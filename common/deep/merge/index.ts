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
        /** Prevents undefined values from obj_b to be written to result */
        skipUndef?: boolean

        /** Resolve merging iof special objects, eg. Set, Date */
        mergeResolve?(obj_a: Obj, obj_b: Obj, propName: string): any

        /**
        * For the cases when there are objects you don't want to merge,
        * but resolve them in a special way
        */
        resolveObject?(obj_a: Obj, obj_b: Obj, propName: string): Obj | symbol | undefined
    }
) => {

    const { mergeResolve, resolveObject, skipUndef } = options || {}
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

                } else {
                    result[a_key] = !skipUndef || isExists(b_value)
                        ?   b_value
                        :   a_value
                }
            } else result[a_key] = a_value
        })

    Object.entries(obj_b)
        .forEach(([ b_key, b_value ]) => {
            if (!Object.prototype.hasOwnProperty.call(obj_a, b_key)) {
                if (!skipUndef || isExists(b_value)) {
                    result[b_key] = b_value
                }
            }
        })


    return result as T & K
}


export default deepMerge
export { resolveAsUndefSymbol }