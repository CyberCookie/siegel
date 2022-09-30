import React from 'react'

import extractProps from './_internals/props_extract'

import type { CoreUIComponent, CoreUIComponentWithDefaults } from './_internals/types'


function withDefaults
<
    _ComponentWithDefaults extends CoreUIComponentWithDefaults<CoreUIComponent<any, any>>,
    _Props extends Parameters<_ComponentWithDefaults>[0],
    _Defaults extends _ComponentWithDefaults['defaults'],
    _NewDefaults extends Partial<_Props>
>
(Component: _ComponentWithDefaults, newDefaults: _NewDefaults) {
    const { ID, defaults } = Component

    const mergedDefaults = extractProps(defaults as _Defaults, newDefaults)
    mergedDefaults.__with_defaults = true

    const componentWithDefaults = (props: PartialKeys<_Props, keyof _NewDefaults>) => (
        <Component { ...extractProps(mergedDefaults, props) } />
    )

    componentWithDefaults.ID = ID
    componentWithDefaults.defaults = mergedDefaults


    return componentWithDefaults
}


export default withDefaults