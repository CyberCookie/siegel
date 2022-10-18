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

    let className = prevClassName || ''
    nextClassName && (className += ` ${nextClassName}`)

    if (prevTheme) {
        result.theme = nextTheme
            ?   { ...prevTheme, ...nextTheme }
            :   prevTheme

        if(_noMergeWithDefaults) {
            if (nextTheme?.root) {
                className = prevTheme.root
                    ?   className.replace(prevTheme.root, nextTheme.root)
                    :   `${className} ${nextTheme.root}`
            }

        } else if (result.theme.root) {
            className += ` ${result.theme.root}`
        }
    }

    result.className = className


    return result
}


export default extractProps