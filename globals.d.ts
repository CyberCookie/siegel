/// <reference types='react' />


declare module '*.sass'

declare module 'picomatch'

declare module 'worker_threads' {
    export type TransferListItem = ArrayBuffer | MessagePort
}


declare function isNaN(value: any): boolean
declare function isFinite(value: any): boolean
declare function parseInt(value: any, radix?: string): number
declare function parseFloat(value: any): number

interface URLSearchParams {
    append(key: string, value: any): void
}


type Fallish = undefined | null | false | 0 | ''

type Primitive = string | number | bigint | boolean | symbol | undefined | null


/**
 * Transforms values union into intersaction
 * @param U - Values union
 */
type UnionToIntersection<U> = (
    U extends any
        ?   (k: U) => void
        :   never
) extends ((k: infer I) => void) ? I : never



/**
 * Recursively iterates over given object and makes its properties optional
 * @param T - Object to iterate over
 */
type DeepPartial<T> = T extends Obj
    ?   T extends AnyFunc
        ?   T
        :   { [P in keyof T]?: DeepPartial<T[P]> }
    :   T



/**
 * Simple object that has string key and optional fields
 * @param V - Object values. Default: any
 */
type Obj<V = any> = Partial<Record<string, V>>

/** Any function with any parameters and return type */
type AnyFunc = (...args: any[]) => any


/**
 * Extracts given object's values
 * @param O - Object
 */
type Values<O extends Obj> = O[keyof O]

/**
 * Makes all the object properties optional with type never
 * @param O - Object
 */
type Never<O extends Obj> = {
    [k in keyof O]?: never
}

/**
 * Extracts only object's required properties keys
 * @param O - Object
 */
type RequiredKeys<O> = { [K in keyof O]-?: object extends Pick<O, K> ? never : K }[keyof O]

/**
 * Extracts only object's optional properties keys
 * @param O - Object
 */
type OptionalKeys<O> = { [K in keyof O]-?: object extends Pick<O, K> ? K : never }[keyof O]

/**
 * Exclude null and undefined from a properties of a given object
 * @param O - Object
 */
type NonNullableProps<O extends Obj> = {
    [k in keyof O]: NonNullable<O[k]>
}

/**
 * Makes fields to be partial in a given object
 * @param O - Object
 * @param K - Object fields
 */
type MakePartialFields<
    O extends Obj,
    K extends keyof O
> = Omit<O, K> & Partial<Pick<O, K>>

/**
 * Makes fields to be required in a given object
 * @param O - Object
 * @param K - Object fields
 */
type MakeRequiredFields<
    O extends Obj,
    K extends keyof O
> = Omit<O, K> & Required<Pick<O, K>>

type MakeReadonlyFields<
    O extends Obj,
    K extends keyof O
> = Omit<O, K> & Readonly<Pick<O, K>>

/**
 * Keeps only object properties thats are equal to a given value
 * @param O - Object
 * @param V - Value
 */
type NarrowObjectToValueTypes<O extends Obj, V> = {
    [K in keyof O as O[K] extends V ? K : never]: V
}

/**
 * From a given object excludes object properties thats are equal to a given value
 * @param O - Object
 * @param V - Value
 */
type ExcludeObjectValueTypes<O extends Obj, V> = {
    [K in keyof O as O[K] extends V ? never : K ]: O[K]
}

/**
 * Transforms object into an array of all possible property paths
 * @param O - Object
 */
type PathsOf<T, R = Required<T>> = Values<{
    [P in keyof R]: NonNullable<R[P]> extends Obj
        ?   [P] | [P, ...PathsOf<NonNullable<R[P]>>]
        :   [P]
}>



/**
 * Takes array T and returns same array but without first element
 * @param T - Array
 */
type Tail<T extends any[]> = ((...t: T) => void) extends ((h: any, ...r: infer R) => void) ? R : never

/**
 * Checks whether a _V is null | undefined
 * @return {true} if _V ex null | undefined
 */
type IsNullable<_V> = [Extract<_V, undefined | null>] extends [never] ? false : true



/**
 * Represents all valid css properties
 */
type CSSWithVariables = {
    [key: `--${string}`]: any
} & React.CSSProperties


/**
 * Represents HTML Tag attributes for a given HTMLElement
 * @param E - HTMLElement
 * @param A - Optional React HTML Tag attributes. Default is React.HTMLAttributes<E>
 */
type ReactTagAttributes<
    E = HTMLElement,
    A = React.HTMLAttributes<E>
> = {
    [key: `data-${string}`]: any
} & A & React.RefAttributes<E>

/**
 * Represents react store created with useState() hook
 * @param S - Store's state
 */
type ReactStore<S> = [ S, React.Dispatch<React.SetStateAction<S>> ]