import type { PropsComponentThemed } from './types'


const mergeThemes = (prevTheme: Indexable, nextTheme: Indexable | undefined) => (
    nextTheme
        ?   Object.assign({}, prevTheme, nextTheme)
        :   prevTheme
)

function extractProps<
    T extends PropsComponentThemed,
    U extends PropsComponentThemed
>
(
    prevProps: T & Indexable,
    newProps: U & Indexable,
    withMergedDefaults: boolean
) {

    const { className: prevClassName, theme: prevTheme } = prevProps
    const { className: nextClassName, theme: nextTheme } = newProps


    const result = Object.assign({}, prevProps, newProps)


    result.className = prevClassName || ''
    nextClassName && (result.className += ` ${nextClassName}`)

    if (prevTheme) {
        result.theme = mergeThemes(prevTheme, nextTheme)

        if(withMergedDefaults) {
            if (nextTheme?.root) {
                result.className = result.className.replace(prevTheme.root!, nextTheme.root)
            }
        } else result.className += ` ${result.theme.root}`
    }


    return result
}


export default extractProps