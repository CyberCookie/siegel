import { memo } from 'react'

import isExists from '../../../common/is/exists'
import isEmptyObj from '../../../common/is/empty_obj'
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


    const Component: Partial<ComponentType> = memo<_Props & _Defaults>(
        props => {

            const mergedProps = props._noMergeWithDefaults
                ?   props
                :   extractProps(defaults, props)


            const defaultProps: Partial<_Props & _Defaults> = {}
            for (const defaultProp in defaults) {
                if (!isExists(mergedProps[defaultProp])) {
                    defaultProps[defaultProp] = defaults[defaultProp]!
                }
            }


            return cb(
                isEmptyObj(defaultProps)
                ?   mergedProps
                :   { ...mergedProps, ...defaultProps }
            )
        },
        (prevProps, nextProps) => nextProps.memoDeps?.(prevProps, nextProps) || false
    )

    Component.ID = ID
    Component.defaults = defaults


    return Component as ComponentType
}


export default component