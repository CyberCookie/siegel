declare module '*.sass'


type UITheme = Record<string, string>


type Indexable<V = any> = {
    [key: string]: V
}


type IndexObjectKeys<K extends string, V = any> = {
    [key in K]: V
} & Indexable


type IndexObject<T, V = any> = {
    [key in keyof T]: V
} & Indexable


type RequiredWithDefaults<T, V = any> = {
    [P in keyof T]-?: V
}