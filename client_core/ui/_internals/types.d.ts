// TODO: component memo API (props.memo)


type ComponentAttributes<
    E = HTMLElement,
    A = React.HTMLAttributes<E>
> = A & React.RefAttributes<E>

type NewComponentAttributes<
    E = HTMLElement,
    A = React.HTMLAttributes<E>,
    CA = Partial<ComponentAttributes<E, A>>
> = CA | ((defAttributes: CA) => CA)


type ComponentRefApi<Props> = {
    getRef(ref: HTMLElement, props: Props): void
    getOnPropsUpdate?(props: Props): any[]
}

type PropsComponentBase<Props extends Indexable = Indexable> = {
    className?: string
    refApi?: ComponentRefApi<Props>
} & Props

type PropsComponentThemed<T extends Indexable = Indexable, Props extends Indexable = Indexable> = {
    theme?: {
        root?: string
    } & T
} & PropsComponentBase<Props>


type CoreIUComponent<P extends PropsComponentThemed, D extends Partial<P>> = {
    (props: P, withDefaults?: boolean): JSX.Element
    defaults: D
    ID: string
}

type CoreIUComponentWithDefaults<C extends CoreIUComponent<any, any>> = {
    (...args: Parameters<C>): ReturnType<C>
    ID: C['ID']
}


export type {
    ComponentAttributes, NewComponentAttributes,
    ComponentRefApi,
    CoreIUComponent, CoreIUComponentWithDefaults,
    PropsComponentBase, PropsComponentThemed
}