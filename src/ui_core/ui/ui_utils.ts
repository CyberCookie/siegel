type ComponentAttributes<E = HTMLDivElement, A = React.HTMLAttributes<E>> = A & React.RefAttributes<E>

type PropsComponentBase = {
    className?: string
}

type PropsComponentThemed<K extends string = string> = {
    theme?: Partial<IndexObjectKeys<K | 'root', string>>
} & PropsComponentBase


type CoreIUComponent<P extends PropsComponentThemed, D extends PropsComponentThemed> = {
    (props: P, withDefaults?: boolean): JSX.Element;
    //#TS_sucks when overload;
    // (props: P & D, withDefaults: false): JSX.Element;
    defaults: D
    ID: string
}

type CoreIUComponentWithDefaults<C extends CoreIUComponent<any, any>> = {
    (...args: Parameters<C>): ReturnType<C>
    ID: C['ID']
}


function extractProps
<
    T extends PropsComponentThemed,
    U extends PropsComponentThemed
>
(defaultProps: T, props: U, withMergedDefaults?: boolean) {

    const { className: defaultClassName, theme: defaultTheme } = defaultProps;
    const { className, theme } = props;
    const result = Object.assign({}, defaultProps, props)
    
    if (className && defaultClassName) {
        result.className += ` ${defaultClassName}`
    }
    result.className ||= ''

    if (defaultTheme) {
        result.theme = theme
            ?   Object.assign({}, defaultTheme, theme)
            :   defaultTheme;
        
        if(withMergedDefaults) {
            theme?.root && result.className.replace(defaultTheme.root!, theme.root)
        } else result.className += ` ${result.theme.root}`
    }


    return result
}


function withDefaults
<
    C extends CoreIUComponent<any, any>,
    NewDefaults extends Partial<Parameters<C>[0]>,
>
(Component: C, newDefaults: NewDefaults) {        
    const mergedDefaults = extractProps(Component.defaults, newDefaults)

    type Props = PartialKeys<Parameters<C>[0], keyof NewDefaults>

    const componentWithDefaults = (props: Props) => Component(extractProps(mergedDefaults, props, true))
    componentWithDefaults.ID = Component.ID;


    return componentWithDefaults
}


export { extractProps, withDefaults }
export type { PropsComponentBase, PropsComponentThemed, ComponentAttributes, CoreIUComponent, CoreIUComponentWithDefaults }