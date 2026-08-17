import { memo } from 'react'

import { isExists, isEmptyObject } from 'siegel-utils'
import extractProps from './props_extract'

import type { CoreUIComponent, PropsComponentThemed } from './types'


function component
<
    _Props extends PropsComponentThemed,
    _Defaults extends Partial<_Props>
>
(
    ID: string,
    defaults: _Defaults,
    cb: (props: _Props & _Defaults) => React.ReactElement
) {

    type ComponentType = CoreUIComponent<_Props, _Defaults>
    type MergedProps = _Props & _Defaults


    const Component: Partial<ComponentType> = memo<MergedProps>(
        props => {

            const mergedProps = props._noMergeWithDefaults
                ?   props
                :   extractProps(defaults, props)


            const defaultProps: Partial<MergedProps> = {}
            Object.keys(defaults)
                .forEach((defaultProp: keyof _Defaults) => {
                    if (!isExists(mergedProps[defaultProp])) {
                        defaultProps[defaultProp] = defaults[defaultProp]!
                    }
                })


            return cb(
                isEmptyObject(defaultProps)
                    ?   mergedProps
                    :   { ...mergedProps, ...defaultProps }
            )
        },

        (prevProps, nextProps) => (
            nextProps.memoDeps?.(
                prevProps as MergedProps,
                nextProps as MergedProps
            )
        ) || false
    )

    Component.ID = ID
    Component.defaults = defaults


    return Component as ComponentType
}


export default component