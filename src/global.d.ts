declare module '*.sass'


type UITheme = {
    [key: string]: string
}

type Indexable<T = any> = {
    [key: string]: T
}

type IndexingObject = {[key: string]: any}