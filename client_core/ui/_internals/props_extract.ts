import type { PropsComponentThemed } from './types'


const mergeThemes = (prevTheme: Indexable, nextTheme: Indexable | undefined) => (
    nextTheme
        ?   Object.assign({}, prevTheme, nextTheme)
        :   prevTheme
)

function extractProps<
    _PrevProps extends PropsComponentThemed,
    _NextProps extends PropsComponentThemed
>
(prevProps: _PrevProps, newProps: _NextProps) {

    const { className: prevClassName, theme: prevTheme } = prevProps
    const { className: nextClassName, theme: nextTheme, __with_defaults } = newProps


    const result = Object.assign({}, prevProps, newProps)

    result.className = prevClassName || ''
    nextClassName && (result.className += ` ${nextClassName}`)

    if (prevTheme) {
        result.theme = mergeThemes(prevTheme, nextTheme)

        if(__with_defaults) {
            if (nextTheme?.root) {
                result.className = result.className.replace(prevTheme.root!, nextTheme.root)
            }
        } else result.className += ` ${result.theme.root}`
    }


    return result
}


export default extractProps