type ComponentAttributes<E = HTMLDivElement, A = React.HTMLAttributes<E>> = A & React.RefAttributes<E>


type PropsComponentBase = {
    className?: string
}

type PropsComponentThemed = {
    theme?: Indexable<string>
} & PropsComponentBase



type CoreIUComponent<P = PropsComponentThemed, D = PropsComponentThemed> = {
    (props: P, withDefaults?: boolean): JSX.Element;
    //#TS_sucks when overload;
    // (props: P & D, withDefaults: true): JSX.Element;
    defaults: D
    ID: string
}




function extractProps
<T extends PropsComponentThemed, U extends PropsComponentThemed>
(defaultProps: T, props: U) {

    let { className, theme } = props;
    let { className: defaultClassName, theme: defaultTheme } = defaultProps;
    let result = Object.assign({}, defaultProps, props)

    if (className && defaultClassName) {
        result.className += ` ${defaultClassName}`
    }
    result.className || (result.className = '')

    if (theme && defaultTheme) {
        //TODO merge values instead keys. or not to do
        result.theme = Object.assign({}, defaultTheme, theme)
    }

    return result
}


const withDefaults = <C extends CoreIUComponent>(Component: C, newDefaults: Parameters<C>[0]) => {
    let mergedDefaults = extractProps(Component.defaults, newDefaults)

    return (props: typeof newDefaults) => Component(
        extractProps(mergedDefaults, props),
        true
    )
}


export { extractProps, withDefaults,
    PropsComponentBase, PropsComponentThemed, ComponentAttributes, CoreIUComponent }