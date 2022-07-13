import { memo } from 'react'

import extractProps from './props_extract'

import type { CoreUIComponent } from './types'


function component
<
    C extends CoreUIComponent<any, any>,
    Defaults extends C['defaults'],
    Props extends Parameters<C['type']>[0]
>
(
    ID: C['ID'],
    defaults: Defaults,
    cb: (props: Props & Defaults) => React.ReactNode
) {

    type ComponentType = CoreUIComponent<Props, Defaults>


    const Component: Partial<ComponentType> = memo<Props>(
        props => {
            // TODO typyng
            const mergedProps = props.__with_defaults
                ?   props
                :   extractProps(defaults, props, false)

            return cb(mergedProps) as Props & Defaults
        }
        ,(prevProps, nextProps) => nextProps.memoDeps?.(prevProps, nextProps)
    )

    Component.ID = ID
    Component.defaults = defaults


    return Component as ComponentType
}


export default component