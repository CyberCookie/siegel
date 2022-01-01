//TODO?: loaderApi


type ComponentAttributes<E = HTMLElement, A = React.HTMLAttributes<E>> = A & React.RefAttributes<E>

type ComponentRefApi<Props> = {
    getRef(ref: HTMLElement, props: Props): void
    getOnPropsUpdate?(props: Props): any[]
}

type PropsComponentBase<Props extends Indexable = Indexable> = {
    refApi?: ComponentRefApi<Props>
    // loaderApi?: boolean | Indexable<boolean>
    className?: string
}

type PropsComponentThemed<K extends string = string, Props extends Indexable = Indexable> = {
    theme?: Partial<Record<K | 'root', string>>
} & PropsComponentBase<Props>


type CoreIUComponent<P extends PropsComponentThemed, D extends Partial<P>> = {
    (props: P, withDefaults?: boolean): JSX.Element
    defaults: D
    ID: string
    recursiveMergeProps?: (Extract<keyof P, string>)[]
}

type CoreIUComponentWithDefaults<C extends CoreIUComponent<any, any>> = {
    (...args: Parameters<C>): ReturnType<C>
    ID: C['ID']
}


export type {
    ComponentAttributes,
    ComponentRefApi,
    CoreIUComponent, CoreIUComponentWithDefaults,
    PropsComponentBase, PropsComponentThemed
}