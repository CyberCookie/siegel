type ComponentRefApi<_Props> = {
    getRef(ref: HTMLElement, props: _Props): void
    getOnPropsUpdate?(props: _Props): any[]
}

type PropsComponentBase<_Props extends Indexable = Indexable> = {
    className?: string
    refApi?: ComponentRefApi<PropsComponentBase<_Props>>
    memoDeps?(
        prevProps: PropsComponentBase<_Props>,
        nextProps: PropsComponentBase<_Props>
    ): boolean
} & _Props

type ThemeProps<_Theme> = {
    theme?: {
        root?: string
    } & _Theme
}
type PropsComponentThemed<
    _Theme extends Indexable = Indexable,
    _Props extends Indexable = Indexable,
    _ThemeProps = ThemeProps<_Theme>
> = PropsComponentBase<_Props & _ThemeProps>



type CoreUIReactTagAttributes<
    _Elem = HTMLElement,
    _ReactElemAttr = React.HTMLAttributes<_Elem>,
    _ComponentAttr = Partial<ReactTagAttributes<_Elem, _ReactElemAttr>>
> = _ComponentAttr | ((defAttributes: _ComponentAttr) => _ComponentAttr)

type CoreUIComponent<
    _Props extends PropsComponentThemed,
    _Defaults extends Partial<P>
> = {
    defaults: _Defaults
    ID: string
} & React.MemoExoticComponent<(props: _Props) => JSX.Element>

type CoreUIComponentWithDefaults<_Component extends CoreUIComponent<any, any>> = {
    (...args: Parameters<_Component>): ReturnType<_Component>
    ID: _Component['ID']
    defaults: _Component['defaults']
}


export type {
    ReactTagAttributes, CoreUIReactTagAttributes,
    ComponentRefApi,
    CoreUIComponent, CoreUIComponentWithDefaults,
    PropsComponentBase, PropsComponentThemed
}