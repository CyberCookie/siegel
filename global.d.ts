declare module '*.sass'
// {
//     const classes: Record<string, string>
//     export default classes
// }



declare function isNaN(value: any): boolean
declare function isFinite(value: any): boolean
declare function parseInt(value: any, radix?: string): number
declare function parseFloat(value: any): number

interface URLSearchParams {
    append(key: string, value: any): void
}


type Fallish = undefined | null | false | 0 | ''


/**
 * Transforms values union into intersaction
 * @param U - values union
 */
type UnionToIntersection<U> = (
    U extends any
        ?   (k: U) => void
        :   never
) extends ((k: infer I) => void) ? I : never



/**
 * Recursively iterates over given object and makes its properties optional
 * @param T - object to iterate over
 */
type DeepPartial<T> = T extends object
    ?   T extends AnyFunc
        ?   T
        :   { [P in keyof T]?: DeepPartial<T[P]> }
    :   T



type __ExtractKeysWithOptionalValueObject<O extends Record<string, any>> = keyof ExcludeObjectValueTypes<
    {
        [K in keyof NarrowObjectToValueTypes<
            ExcludeObjectValueTypes<
                Required<O>,
                undefined
            >,
            object
        >]: undefined extends O[K] ? O[K] : never
    },
    never
>
/**
 * Recursively merges two objects
 * @param O1 - object
 * @param O2 - object
 */
type DeepMerge<
    O1 extends Record<string, any>,
    O2 extends Record<string, any>,
    BothObjectKeys = keyof NarrowObjectToValueTypes<Required<O1>, object> & keyof NarrowObjectToValueTypes<Required<O2>, object>
> =
    {
        [K in (
            RequiredKeys<NarrowObjectToValueTypes<O1, object>> & RequiredKeys<NarrowObjectToValueTypes<O2, object>>
        )]: DeepMerge<O1[K], O2[K]>
    } &

    {
        [K in (
            __ExtractKeysWithOptionalValueObject<O1> & __ExtractKeysWithOptionalValueObject<O2>
        )]?: DeepMerge<Partial<NonNullable<O1[K]>>, Partial<NonNullable<O2[K]>>>
    } &

    {
        [K in (
            RequiredKeys<NarrowObjectToValueTypes<O1, object>> & __ExtractKeysWithOptionalValueObject<O2>
        )]: DeepMerge<O1[K], Partial<NonNullable<O2[K]>>>
    } &

    {
        [K in (
            __ExtractKeysWithOptionalValueObject<O1> & RequiredKeys<NarrowObjectToValueTypes<O2, object>>
        )]: DeepMerge<Partial<NonNullable<O1[K]>>, O2[K]>
    } &


    { [K in Exclude<RequiredKeys<O1> & OptionalKeys<O2>, BothObjectKeys>]: Exclude<O1[K] | O2[K], undefined> } &
    { [K in Exclude<RequiredKeys<O2>, BothObjectKeys>]: O2[K] } &
    { [K in Exclude<OptionalKeys<O1> & OptionalKeys<O2>, BothObjectKeys>]?: O1[K] | O2[K] } &
    { [K in keyof Omit<O1, keyof O2>]: O1[K] } &
    { [K in keyof Omit<O2, keyof O1>]: O2[K] }



/**
 * Simple object that has string key and optional fields
 * @param V - object values. Default: any
 */
type Obj<V = any> = Partial<Record<string, V>>

/** Any function with any parameters and return type */
type AnyFunc = (...args: any[]) => any


/**
 * Extracts given object's values
 * @param O - object
 */
type Values<O extends Obj> = O[keyof O]

/**
 * Makes all the object properties optional with type never
 * @param O - object
 */
type Never<O extends Obj> = {
    [k in keyof O]?: never
}

/**
 * Extracts only object's required properties keys
 * @param O - object
 */
type RequiredKeys<O> = { [K in keyof O]-?: object extends Pick<O, K> ? never : K }[keyof O]

/**
 * Extracts only object's optional properties keys
 * @param O - object
 */
type OptionalKeys<O> = { [K in keyof O]-?: object extends Pick<O, K> ? K : never }[keyof O]

/**
 * Exclude null and undefined from a properties of a given object
 * @param O - object
 */
type NonNullableProps<O extends Obj> = {
    [k in keyof O]: NonNullable<O[k]>
}

/**
 * Makes fields to be partial in a given object
 * @param O - object
 * @param K - object fields
 */
type MakePartialFields<
    O extends Obj,
    K extends keyof O
> = Omit<O, K> & Partial<Pick<O, K>>

/**
 * Makes fields to be required in a given object
 * @param O - object
 * @param K - object fields
 */
type MakeRequiredFields<
    O extends Obj,
    K extends keyof O
> = Omit<O, K> & Required<Pick<O, K>>

/**
 * Keeps only object properties thats are equal to a given value
 * @param O - object
 * @param V - value
 */
type NarrowObjectToValueTypes<O extends Obj, V> = {
    [K in keyof O as O[K] extends V ? K : never]: V
}

/**
 * From a given object excludes object properties thats are equal to a given value
 * @param O - object
 * @param V - value
 */
type ExcludeObjectValueTypes<O extends Obj, V> = {
    [K in keyof O as O[K] extends V ? never : K ]: O[K]
}

/**
 * Transforms object into an array of all possible property paths
 * @param O - object
 */
type PathsOf<T, R = Required<T>> = Values<{
    [P in keyof R]: NonNullable<R[P]> extends Obj
        ?   [P] | [P, ...PathsOf<NonNullable<R[P]>>]
        :   [P]
}>



/**
 * Takes array T and returns same array but without first element
 * @param T - array
 */
type Tail<T extends any[]> = ((...t: T) => void) extends ((h: any, ...r: infer R) => void) ? R : never

/**
 * Checks whether a _V is null | undefined
 * @return {true} if _V ex null | undefined
 */
type IsNullable<_V> = Extract<_V, undefined | null> extends never ? false : true



/**
 * Represents all valid css properties
 */
type CSSWithVariables = {
    [key: `--${string}`]: string | number
} & React.CSSProperties


/**
 * Represents HTML Tag attributes for a given HTMLElement
 * @param E - HTMLElement
 * @param A - optional React HTML Tag attributes. Default is React.HTMLAttributes<E>
 */
type ReactTagAttributes<
    E = HTMLElement,
    A = React.HTMLAttributes<E>
> = {
    [key: `data-${string}`]: string | boolean | number | undefined
} & A & React.RefAttributes<E>

/**
 * Represents react store created with useState() hook
 * @param S - store's state
 */
type ReactStore<S> = [ S, React.Dispatch<React.SetStateAction<S>> ]