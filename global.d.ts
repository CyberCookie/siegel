declare module '*.png'
declare module '*.jpg'
declare module '*.sass' {
    const classes: Obj<string | undefined>
    export default classes
}


declare function isNaN(value: any): boolean
declare function isFinite(value: any): boolean
declare function parseInt(value: any, radix?: string): number
declare function parseFloat(value: any): number

interface URLSearchParams {
    append(key: string, value: any): void
}


/**
 * Recursively iterates over given object and makes its properties optional
 * @param T - object to iterate over
 */
type DeepPartial<T> = T extends object
    ?   T extends Function
        ?   T
        :   { [P in keyof T]?: DeepPartial<T[P]> }
    :   T


type DeepMerge<O1 extends Required<object>, O2 extends object> =
    {
        [K in keyof O1 & keyof O2]: O2[K] extends object
            ?   O1[K] extends object
                ?   DeepMerge<O1[K], O2[K]>
                :   O2[K]
            :   Extract<O2[K], undefined> extends never
                ?   O2[K]
                :   Extract<O1[K], undefined> extends never
                    ?   O1[K]
                    :   O2[K]
    }
    &
    { [K in keyof Omit<O1, keyof O2>]: O1[K] }
    &
    { [K in keyof Omit<O2, keyof O1>]: O2[K] }



/**
 * Simple object with string as a keys
 * @param V - object values. Default: any
 */
type Obj<V = any> = Record<string, V>

/**
 * Extracts given object's values
 * @param O - object
 */
type Values<O extends Obj> = O[keyof O]

/**
 * Makes all the object properties optional never
 * @param O - object
 */
type Never<O extends Obj> = {
    [k in keyof O]?: never
}

/**
 * Extracts only object's required properties keys
 * @param O - object
 */
type RequiredKeys<O> = { [K in keyof O]-?: {} extends Pick<O, K> ? never : K }[keyof O]

/**
 * Extracts only object's optional properties keys
 * @param O - object
 */
type OptionalKeys<O> = { [K in keyof O]-?: {} extends Pick<O, K> ? K : never }[keyof O]

/**
 * Exclude null and undefined from a properties of a given object
 * @param O - object
 */
type NonNullableProps<O extends Obj> = {
    [k in keyof O]: NonNullable<O[k]>
}

/**
 * Keeps only object properties thats are equal to a given value
 * @param O - object
 * @param V - value
 */
type NarrowObjectToValueTypes<O extends Obj, V> = {
    [K in keyof O as O[K] extends V ? K : never]: V
}

type PathsOf<T, R = Required<T>> = Values<{
    [P in keyof R]: [P] | [P, ...PathsOf<R[P]>]
}>



type Tail<T extends any[]> = ((...t: T) => void) extends ((h: any, ...r: infer R) => void) ? R : never




type CSSWithVariables = {
    [key: `--${string}`]: string | number
} & React.CSSProperties


type ReactTagAttributes<
    E = HTMLElement,
    A = React.HTMLAttributes<E>
> = {
    [key: `data-${string}`]: string | boolean | number | undefined
} & A & React.RefAttributes<E>

type ReactStore<State> = [ State, React.Dispatch<React.SetStateAction<State>> ]