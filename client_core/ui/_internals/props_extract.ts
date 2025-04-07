//TODO: themeExtend prop

import { isValidElement } from 'react'
import deepMerge from '../../../common/deep/merge'

import type { PropsComponentThemed } from './types'


function extractProps<
    _PrevProps extends PropsComponentThemed,
    _NextProps extends PropsComponentThemed
>
(prevProps: _PrevProps, newProps: _NextProps) {

    const { className: prevClassName, theme: prevTheme, _noMergeWithDefaults } = prevProps
    const { className: nextClassName, theme: nextTheme } = newProps


    const result = deepMerge(
        prevProps,
        newProps,
        {
            resolveObject: (obj_a, obj_b) => (
                isValidElement(obj_a) && isValidElement(obj_b)
                    ?   obj_b
                    :   undefined
            )
        }
    )

    let className = prevClassName || ''
    nextClassName && (className += ` ${nextClassName}`)

    if (prevTheme) {
        if (_noMergeWithDefaults) {
            if (nextTheme?.root) {
                className = prevTheme.root
                    ?   className.replace(prevTheme.root, nextTheme.root)
                    :   `${className} ${nextTheme.root}`
            }

        } else if (result.theme!.root) {
            className += ` ${result.theme!.root}`
        }
    }


    result.className = className


    return result
}


export default extractProps