import isE from '../utils/is_exists'


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


function extractProps
<
    T extends PropsComponentThemed,
    U extends PropsComponentThemed
>
(defaultProps: T, props: U) {

    const { className, theme } = props;
    const { className: defaultClassName, theme: defaultTheme } = defaultProps;
    const result = Object.assign({}, defaultProps, props)
    
    if (className && defaultClassName) {
        result.className += ` ${defaultClassName}`
    }
    isE(result.className) || (result.className = '')

    if (defaultTheme) {
        //TODO merge values instead keys. or not to do
        result.theme = theme
            ?   Object.assign({}, defaultTheme, theme)
            :   defaultTheme;
        
        result.className += ` ${result.theme.root}`
    }


    return result
}


function withDefaults
<
    C extends CoreIUComponent<any, any>,
    NewDefaults extends Partial<Parameters<C>[0]>,
    ComponentDefaults = C['defaults']
>
(Component: C, newDefaults: NewDefaults & Partial<Parameters<C>[0]>) {
    const mergedDefaults = extractProps(Component.defaults as ComponentDefaults, newDefaults)

    type Props = PartialKeys<Parameters<C>[0], keyof ComponentDefaults | keyof NewDefaults>
    return (props: Props) => Component(
        extractProps(mergedDefaults, props),
        false
    )
}


export { extractProps, withDefaults,
    PropsComponentBase, PropsComponentThemed, ComponentAttributes, CoreIUComponent }