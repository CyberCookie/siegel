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
    // (props: P & D, withDefaults: true): JSX.Element;
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
        if (theme) {
            //TODO merge values instead keys. or not to do
            result.theme = Object.assign({}, defaultTheme, theme)
        }
        
        result.className += ` ${result.theme!.root}`
    }


    return result
}


function withDefaults
<
    C extends CoreIUComponent<any, any>,
    P extends Partial<Parameters<C>[0]>,
    D = C['defaults']
>
(Component: C, newDefaults: P & Partial<Parameters<C>[0]>) {
    type PP = Parameters<C>[0]
    const mergedDefaults = extractProps(Component.defaults as D, newDefaults)

    type Props = PartialKeys<PP, keyof D | keyof P>
    return (props: Props) => Component(
        extractProps(mergedDefaults, props),
        true
    )
}


export { extractProps, withDefaults,
    PropsComponentBase, PropsComponentThemed, ComponentAttributes, CoreIUComponent }