declare module '*.sass'


type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<T>

type Indexable<V = any> = {
    [key: string]: V
}

type IndexObject<T, V = any> = {
    [key in keyof T]: V
}

type Tail<T extends any[]> = ((...t: T) => void) extends ((h: any, ...r: infer R) => void) ? R : never

type NarrowObjectToValueTypes<O extends Indexable, T> = {
    [k in keyof O as O[k] extends T ? k : never]: T
}

type CSSWithVariables = {
    [key: string]: string | number
} & React.CSSProperties


interface URLSearchParams {
    append(key: string, value: any): void
}
declare function isNaN(value: any): boolean
declare function isFinite(value: any): boolean
declare function parseInt(value: any, radix?: string): number