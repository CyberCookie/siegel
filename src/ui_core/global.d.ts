declare module '*.sass'


type SortReturnValue = -1 | 0 | 1


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
// type X = Parameters<typeof window.parseInt>[1]
interface Array<T = any> {
    [key: string]: T
}
declare function isNaN(value: any): boolean
declare function isFinite(value: any): boolean
declare function parseInt(value: any, radix?: string): number