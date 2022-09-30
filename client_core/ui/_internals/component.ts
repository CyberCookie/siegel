import { memo } from 'react'

import extractProps from './props_extract'

import type { CoreUIComponent } from './types'


function component
<
    _Component extends CoreUIComponent<any, any>,
    _ID extends string,
    _Defaults extends _Component['defaults'],
    _Props extends Parameters<_Component['type']>[0]
>
(
    ID: _ID,
    defaults: _Defaults,
    cb: (props: _Props & _Defaults) => React.ReactNode
) {

    type ComponentType = CoreUIComponent<_Props, _Defaults>


    const Component: Partial<ComponentType> = memo<_Props>(
        props => {

            const mergedProps = props.__with_defaults
                ?   props
                :   extractProps(defaults, props)

            return cb(mergedProps) as _Props & _Defaults
        },
        (prevProps, nextProps) => nextProps.memoDeps?.(prevProps, nextProps)
    )

    Component.ID = ID
    Component.defaults = defaults


    return Component as ComponentType
}


export default component