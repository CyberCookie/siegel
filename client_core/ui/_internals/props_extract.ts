// TODO: merge nested components theme property


import type { PropsComponentThemed } from './types'


function extractProps<
    _PrevProps extends PropsComponentThemed,
    _NextProps extends PropsComponentThemed
>
(prevProps: _PrevProps, newProps: _NextProps) {

    const { className: prevClassName, theme: prevTheme, _noMergeWithDefaults } = prevProps
    const { className: nextClassName, theme: nextTheme } = newProps


    const result = { ...prevProps, ...newProps }

    result.className = prevClassName || ''
    nextClassName && (result.className += ` ${nextClassName}`)

    if (prevTheme) {
        result.theme = nextTheme
            ?   { ...prevTheme, ...nextTheme }
            :   prevTheme

        if(_noMergeWithDefaults) {
            if (nextTheme?.root) {
                result.className = result.className.replace(prevTheme.root!, nextTheme.root)
            }

        } else if (result.theme.root) {
            result.className += ` ${result.theme.root}`
        }
    }


    return result
}


export default extractProps