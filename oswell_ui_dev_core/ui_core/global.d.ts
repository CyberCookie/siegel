declare module '*.sass'


type ID = string | number



type Indexable<V = any> = {
    [key: string]: V
}


type IndexObjectKeys<K extends string, V = any> = {
    [key in K]: V
} & Indexable


type IndexObject<T, V = any> = {
    [key in keyof T]: V
} & Indexable