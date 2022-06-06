import React from 'react'

import extractProps from './_internals/props_extract'
import type { CoreUIComponent } from './_internals/types'


function withDefaults
<
    C extends CoreUIComponent<any, any>,
    Props extends Parameters<C>[0],
    NewDefaults extends Partial<Props>
>
(Component: C, newDefaults: NewDefaults) {
    const { ID, defaults } = Component
    const mergedDefaults = extractProps(defaults, newDefaults, false)

    const componentWithDefaults = (props: PartialKeys<Props, keyof NewDefaults>) => (
        <Component { ...extractProps(mergedDefaults, props, true) } __with_defaults />
    )
    componentWithDefaults.ID = ID


    return componentWithDefaults
}


export default withDefaults