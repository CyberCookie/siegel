import isExists from '../../is/exists'


type Expand<T> = T extends object
    ?   { [K in keyof T]: Expand<T[K]> }
    :   T

type NormalizeOptions<O> = O extends { skipUndef: true } ? true : false


type BuiltInNonPlainObjects =
    |   any[]
    |   RegExp
    |   Date
    |   AnyFunc
    |   Map<any, any> | Set<any> | WeakMap<any, any> | WeakSet<any>
    |   Promise<any>
    |   Error
    |   ArrayBuffer | SharedArrayBuffer | DataView
    |   Int8Array | Uint8Array | Uint8ClampedArray
        |   Int16Array | Uint16Array
        |   Int32Array | Uint32Array
        |   Float32Array | Float64Array
        |   BigInt64Array | BigUint64Array

type IsPlainObject<T> = T extends object
    ?   T extends BuiltInNonPlainObjects
        ?   false
        :   Obj extends T
            ?   true
            :   T extends Obj
                ?   true
                :   false
    :   false


type ResolveOverwrite<X, Y, SkipUndef extends boolean> = SkipUndef extends true
    ?   undefined extends Y
        ?   [Exclude<Y, undefined>] extends [never]
            ?   X
            :   Exclude<Y, undefined> | X
        :   Y
    :   Y

type DeepMerge<X, Y, SkipUndef extends boolean> = IsPlainObject<X> extends true
    ?   IsPlainObject<Y> extends true
        ?       { [K in keyof X as K extends keyof Y ? never : K]: X[K] }
            &   {
                    [K in keyof Y as K extends keyof X
                        ?   never
                        :   SkipUndef extends true
                            ?   [Exclude<Y[K], undefined>] extends [never] ? never : K
                            :   K
                    ]: SkipUndef extends true ? Exclude<Y[K], undefined> : Y[K]
                }
            &   {
                    [K in keyof X & keyof Y]: SkipUndef extends true
                        ?   [Exclude<Y[K], undefined>] extends [never]
                            ?   X[K]
                            :   undefined extends Y[K]
                                ?   DeepMerge<X[K], Exclude<Y[K], undefined>, true> | X[K]
                                :   DeepMerge<X[K], Y[K], true>

                        :   IsPlainObject<X[K]> extends true
                            ?   IsPlainObject<Y[K]> extends true
                                ?   DeepMerge<X[K], Y[K], false>
                                :   Y[K]
                            :   Y[K]
                }
        :   ResolveOverwrite<X, Y, SkipUndef>
    :   ResolveOverwrite<X, Y, SkipUndef>



// // Helper to determine if a key is genuinely optional inside a specific object
// type IsOptionalKey<T, K extends keyof T> = {} extends Pick<T, K> ? true : false;

// // Core engine that evaluates the inner types for shared keys
// type MergeSharedValue<XVal, YVal, SkipUndef extends boolean> =
//     IsPlainObject<XVal> extends true
//         ?   IsPlainObject<Exclude<YVal, undefined>> extends true
//             ?   SkipUndef extends true
//                 ?   undefined extends YVal
//                     ?   DeepMergeEngine<XVal, Exclude<YVal, undefined>, true> | XVal
//                     :   DeepMergeEngine<XVal, YVal, true>
//                 :   DeepMergeEngine<XVal, YVal, false>
//             :   ResolveOverwrite<XVal, YVal, SkipUndef>
//         :   ResolveOverwrite<XVal, YVal, SkipUndef>;

// // Primary evaluation engine
// type DeepMergeEngine<X, Y, SkipUndef extends boolean> = {
//     // Stage 1: Build structural type layout containing all possible fields
//     [K in keyof X | keyof Y]: K extends keyof X
//         ?   K extends keyof Y
//             ?   MergeSharedValue<X[K], Y[K], SkipUndef> // In both X and Y
//             :   X[K] // Only in X
//         :   K extends keyof Y
//             ?   SkipUndef extends true
//                 ?   [Exclude<Y[K], undefined>] extends [never] ? never : Exclude<Y[K], undefined>
//                 :   Y[K] // Only in Y
//             :   never
// } extends infer O
//     ?   {
//             // Stage 2: Pick fields that MUST be optional (?)
//             [K in keyof O as
//                 // A: Only in Y and was optional
//                 (K extends keyof Y ? K extends keyof X ? never : IsOptionalKey<Y, K> extends true ? K : never : never) |
//                 // B: Only in X and was optional
//                 (K extends keyof X ? K extends keyof Y ? never : IsOptionalKey<X, K> extends true ? K : never : never) |
//                 // C: In both, and BOTH are optional (or Y is optional and skipUndef is active)
//                 (K extends keyof X ? K extends keyof Y ? IsOptionalKey<X, K> extends true ? (IsOptionalKey<Y, K> extends true ? K : never) : never : never : never)
//             ]?: O[K]
//         } & {
//             // Stage 3: Pick fields that MUST be required
//             [K in keyof O as
//                 // D: Required in X OR Required in Y (Required status always breaks optionals during a merge)
//                 (K extends keyof X ? IsOptionalKey<X, K> extends false ? K : never : never) |
//                 (K extends keyof Y ? IsOptionalKey<Y, K> extends false ? K : never : never)
//             ]: O[K]
//         } extends infer Intersected
//             // Stage 4: Flat map the structural intersection out into a single uniform object map
//             ? { [K in keyof Intersected]: Intersected[K] }
//             : never
//     : never;

// // Entry generic mirroring your wrapper call signature
// type DeepMerge<X, Y, SkipUndef extends boolean> =
//     IsPlainObject<X> extends true
//         ?   IsPlainObject<Y> extends true
//             ?   DeepMergeEngine<X, Y, SkipUndef>
//             :   ResolveOverwrite<X, Y, SkipUndef>
//         :   ResolveOverwrite<X, Y, SkipUndef>;


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
    K extends Obj,
    S extends {
        /** Prevents undefined values from obj_b to be written to result */
        skipUndef?: boolean

        /** Resolve merging of special objects, eg. Set, Date */
        mergeResolve?(obj_a: Obj, obj_b: Obj, propName: string): any

        /**
        * For the cases when there are objects you don't want to merge,
        * but resolve them in a special way
        */
        resolveObject?(obj_a: Obj, obj_b: Obj, propName: string): Obj | symbol | undefined
    }
>(
    obj_a: T,
    obj_b: K,
    options?: S
) => {

    const { mergeResolve, resolveObject, skipUndef } = options || {}
    const result: Obj = {}

    Object.entries(obj_a)
        .forEach(([ a_key, a_value ]) => {

            if (Object.prototype.hasOwnProperty.call(obj_b, a_key)) {
                const b_value = obj_b[a_key]

                if (typeof a_value === 'object' && typeof b_value === 'object') {
                    if (a_value?.constructor === Object && b_value?.constructor === Object) {
                        const resolvedObj = resolveObject?.(a_value, b_value, a_key)
                        result[a_key] = isExists(resolvedObj)
                            ?   resolvedObj === resolveAsUndefSymbol
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


    return result as T & K //Expand<DeepMerge<T, K, NormalizeOptions<S>>>
}


export default deepMerge
export { resolveAsUndefSymbol }
export type { DeepMerge }



// Skip undef is falsy


// Base
// type X = { a: 0, b: 0 }
// type Y = { a: 1, c: 1 }
// type Z = { a: 1, b: 0, c: 1 }

// type X = { b: 0 }
// type Y = {}
// type Z = { b: 0 }

// type X = {}
// type Y = { c: 1 }
// type Z = { c: 1 }



// Merge with optional field gives us a union of all possilbe outcomes
// type X = { a: 0 }
// type Y = { a?: 1 }
// type Z = { a: 0 | 1 }

// type X = { b?: 0 }
// type Y = { b?: 1 }
// type Z = { b?: 0 | 1 }

// type X = { c?: 0 }
// type Y = { c: 1 }
// type Z = { c: 1 }

// type X = {
//     a: { b: 1 }
// }
// type Y = {
//     a?: { b?: 0 }
// }
// type Z = {
//     a: { b: 1 | 0 }
// }

// type X = {
//     a?: { b?: 1 }
// }
// type Y = {
//     a?: { b?: 0 }
// }
// type Z = {
//     a?: { b?: 1 | 0 }
// }