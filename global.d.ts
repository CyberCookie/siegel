declare module '*.png'
declare module '*.jpg'
declare module '*.sass'


declare function isNaN(value: any): boolean
declare function isFinite(value: any): boolean
declare function parseInt(value: any, radix?: string): number

interface URLSearchParams {
    append(key: string, value: any): void
}



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


type DeepExclude<O1 extends object, O2 extends object> =
    {
        [K in keyof O1 & keyof O2]?: O2[K] extends object
            ?   O1[K] extends object
                ?   DeepExclude<O1[K], O2[K]>
                :   O2[K]
            :   O2[K]
    }
    &
    { [K in keyof Omit<O2, keyof O1>]: O2[K] }



type Indexable<V = any> = {
    [key: string]: V
}

type IndexObject<T, V = any> = {
    [key in keyof T]: V
}

type Never<O extends Indexable> = {
    [k in keyof O]?: never
}

type NonNullableKeys<T extends Indexable> = {
    [k in keyof T]: NonNullable<T[k]>
}

type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<T>

type NarrowObjectToValueTypes<O extends Indexable, T> = {
    [k in keyof O as O[k] extends T ? k : never]: T
}
type Values<K extends Indexable> = K[keyof K]



type Tail<T extends any[]> = ((...t: T) => void) extends ((h: any, ...r: infer R) => void) ? R : never



type CSSWithVariables = {
    [key: string]: string | number
} & React.CSSProperties


type AttributesWithData = {
    [key: string]: string | number
} & React.HTMLAttributes<HTMLDivElement>