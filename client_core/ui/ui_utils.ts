//TODO:? refApi fn arguments infer proper types

import { useEffect, useRef } from 'react'


type ComponentAttributes<E = HTMLElement, A = React.HTMLAttributes<E>> = A & React.RefAttributes<E>

type ComponentRefApi<Props> = {
    getRef(ref: HTMLElement): void
    getOnPropsUpdate?(props: Props): any[]
}

type PropsComponentBase<Props extends Indexable = Indexable> = {
    refApi?: ComponentRefApi<Props>
    loaderApi?: boolean | Indexable<boolean>
    className?: string
}

type PropsComponentThemed<K extends string = string, Props extends Indexable = Indexable> = {
    theme?: Partial<Record<K | 'root', string>>
} & PropsComponentBase<Props>


type CoreIUComponent<P extends PropsComponentThemed, D extends PropsComponentThemed> = {
    (props: P, withDefaults?: boolean): JSX.Element
    defaults: D
    ID: string
    recursiveMergeProps?: (Extract<keyof P, string>)[]
}

type CoreIUComponentWithDefaults<C extends CoreIUComponent<any, any>> = {
    (...args: Parameters<C>): ReturnType<C>
    ID: C['ID']
}



function applyRefApi(rootProps: ComponentAttributes, mergedProps: PropsComponentBase) {
    const { getRef, getOnPropsUpdate } = mergedProps.refApi!
    rootProps.ref = useRef(null)

    const trackDependencies = getOnPropsUpdate
        ?   getOnPropsUpdate(mergedProps)
        :   undefined

    useEffect(() => {
        getRef((rootProps.ref as React.MutableRefObject<HTMLElement>).current)
    }, trackDependencies)
}


function extractProps<
    T extends PropsComponentThemed,
    U extends PropsComponentThemed
>
(defaultProps: T & Indexable, props: U & Indexable, withMergedDefaults: boolean, recursiveMergeProps?: string[]) {

    const { className: defaultClassName, theme: defaultTheme } = defaultProps
    const { className, theme } = props

    recursiveMergeProps?.forEach(prop => {
        const _prop = props[prop]
        const defaultProp = defaultProps[prop]

        _prop && defaultProp
            && Object.assign(_prop, extractProps(defaultProp, _prop, withMergedDefaults))
    })

    const result = Object.assign({}, defaultProps, props)

    if (className && defaultClassName) {
        result.className += ` ${defaultClassName}`
    }
    result.className ||= ''

    if (defaultTheme) {
        result.theme = theme
            ?   Object.assign({}, defaultTheme, theme)
            :   defaultTheme

        if(withMergedDefaults) {
            theme?.root && (result.className = result.className.replace(defaultTheme.root!, theme.root))
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
    const { ID, defaults, recursiveMergeProps } = Component
    const mergedDefaults = extractProps(defaults, newDefaults, false, recursiveMergeProps)

    type Props = PartialKeys<Parameters<C>[0], keyof NewDefaults>

    const componentWithDefaults = (props: Props) => Component(extractProps(mergedDefaults, props, true, recursiveMergeProps))
    componentWithDefaults.ID = ID


    return componentWithDefaults
}


export { extractProps, withDefaults, applyRefApi }
export type { PropsComponentBase, PropsComponentThemed, ComponentAttributes, CoreIUComponent, CoreIUComponentWithDefaults, ComponentRefApi }