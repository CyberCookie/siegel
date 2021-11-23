import type { PropsComponentThemed } from './types'


function extractProps<
    T extends PropsComponentThemed,
    U extends PropsComponentThemed
>
(prevProps: T & Indexable, newProps: U & Indexable, withMergedDefaults: boolean, recursiveMergeProps?: string[]) {

    const { className: prevClassName, theme: prevTheme } = prevProps
    const { className: nextClassName, theme: nextTheme } = newProps

    recursiveMergeProps?.forEach(prop => {
        const _prop = newProps[prop]
        const defaultProp = prevProps[prop]

        _prop && defaultProp
            && Object.assign(_prop, extractProps(defaultProp, _prop, withMergedDefaults))
    })

    const result = Object.assign({}, prevProps, newProps)

    result.className = prevClassName || ''
    nextClassName && (result.className += ` ${nextClassName}`)


    if (prevTheme) {
        result.theme = nextTheme
            ?   Object.assign({}, prevTheme, nextTheme)
            :   prevTheme

        if(withMergedDefaults) {
            nextTheme?.root && (result.className = result.className.replace(prevTheme.root!, nextTheme.root))
        } else result.className += ` ${result.theme.root}`
    }


    return result
}


export default extractProps