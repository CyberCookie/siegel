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
    refApi?: ComponentRefApi<PropsComponentBase<Props>>
    memoDeps?(prevProps: PropsComponentBase<Props>, nextProps: PropsComponentBase<Props>): boolean
} & Props

type ThemeProps<T> = {
    theme?: {
        root?: string
    } & T
}
type PropsComponentThemed<
    Theme extends Indexable = Indexable,
    Props extends Indexable = Indexable,
    _ThemeProps = ThemeProps<Theme>
> = PropsComponentBase<Props & _ThemeProps>



type CoreUIComponent<P extends PropsComponentThemed, D extends Partial<P>> = {
    defaults: D
    ID: string
} & React.MemoExoticComponent<(props: P) => JSX.Element>

type CoreUIComponentWithDefaults<C extends CoreUIComponent<any, any>> = {
    (...args: Parameters<C>): ReturnType<C>
    ID: C['ID']
}


export type {
    ComponentAttributes, NewComponentAttributes,
    ComponentRefApi,
    CoreUIComponent, CoreUIComponentWithDefaults,
    PropsComponentBase, PropsComponentThemed
}