type ComponentRefApi<_Props> = {
    /**
     * Callback to retrieve a ref.
     * By default triggers only once after the first render
     *
     * @param ref component root tag ref
     * @param props passed component props
     */
    getRef(ref: HTMLElement, props: _Props): void

    /**
     * Provides array of values to compare during each rerender.
     * Triggers getRef if some values have changed
     *
     * @param props passed component props
     * @return array of values to compare after each render
     */
    getOnPropsUpdate?(props: _Props): any[]
}

type PropsComponentBase<_Props extends Obj = Obj> = {
    /**
     * Internal Siegel property.
     * Using to indicate whether to merge provided component props with default ones
     */
    _noMergeWithDefaults?: boolean

    /** Root tag class name */
    className?: string

    /** Provides access to root tag DOM element once it was rendered */
    refApi?: ComponentRefApi<PropsComponentBase<_Props>>

    /**
     * Works the same way as React.memo
     *
     * @param prevProps old component props
     * @param nextProps new component props
     */
    memoDeps?(
        prevProps: PropsComponentBase<_Props>,
        nextProps: PropsComponentBase<_Props>
    ): boolean
} & _Props

type ThemeProps<_Theme> = {
    /** Class names to be applied to a component elements */
    theme?: {
        /** Root tag class name */
        root?: string
    } & _Theme
}
type PropsComponentThemed<
    _Theme extends Obj = Obj,
    _Props extends Obj = Obj,
    _ThemeProps = ThemeProps<_Theme>
> = PropsComponentBase<_Props & _ThemeProps>



type DivTagAttributes = ReactTagAttributes<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>


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
    DivTagAttributes, ReactTagAttributes, CoreUIReactTagAttributes,
    ComponentRefApi,
    CoreUIComponent, CoreUIComponentWithDefaults,
    PropsComponentBase, PropsComponentThemed
}