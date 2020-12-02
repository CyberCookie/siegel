declare module '*.sass'


type ID = string | number


type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<T>


type Indexable<V = any> = {
    [key: string]: V
}

type IndexObjectKeys<K extends string, V = any> = {
    [key in K]: V
}

type IndexObject<T, V = any> = {
    [key in keyof T]: V
}


//#TS_sucks.
interface Array<T = any> {
    [key: string]: T
}
//TODO
// interface Math {
//     max: (...args: any[]) => number
// }
declare function isNaN(value: any): boolean
declare function isFinite(value: any): boolean
declare function parseInt(value: any, radix?: string): number