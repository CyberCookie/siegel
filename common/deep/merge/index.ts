import isExists from '../../is/exists'


const resolveAsUndefSymbol = Symbol('undef')

const deepMerge = <
    T extends Indexable,
    K extends Indexable
>(
    obj_a: T,
    obj_b: K,
    options?: {
        mergeResolve?(obj_a: Indexable, obj_b: Indexable, propName: string): any
        resolveObject?(obj_a: Indexable, obj_b: Indexable, propName: string): Indexable | symbol | undefined
    }
) => {

    const { mergeResolve, resolveObject } = options || {}
    const result: Indexable = {}

    for (const key in obj_a) {
        const objValue_a = obj_a[key as keyof T]

        if (key in obj_b) {
            const objValue_b = obj_b[key as keyof K]

            if (typeof objValue_a == 'object' && typeof objValue_b == 'object') {
                if (objValue_a?.constructor == Object && objValue_b?.constructor == Object) {
                    const resolvedObj = resolveObject?.(objValue_a, objValue_b, key)
                    result[key] = isExists(resolvedObj)
                        ?   resolvedObj == resolveAsUndefSymbol
                            ?   undefined
                            :   resolvedObj
                        :   deepMerge(objValue_a, objValue_b, options)

                } else {
                    result[key] = mergeResolve
                        ?   mergeResolve(objValue_a, objValue_b, key)
                        :   objValue_b
                }

            } else result[key] = objValue_b
        } else result[key] = objValue_a
    }

    for (const key in obj_b) {
        if (!(key in obj_a)) result[key] = obj_b[key as keyof K]
    }


    return result as T & K
}


export default deepMerge
export { resolveAsUndefSymbol }