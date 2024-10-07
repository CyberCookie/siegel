import React from 'react'

import extractProps from './_internals/props_extract'

import type { CoreUIComponent, CoreUIComponentWithDefaults } from './_internals/types'


type NewProps<_Props extends Obj, _NewDefaults extends Partial<_Props>> = {
    [K in keyof _Props & keyof _NewDefaults]?: _NewDefaults[K] extends object
        ?   _NewDefaults[K] extends Extract<_NewDefaults[K], AnyFunc>
            ?   _Props[K]
            :   NonNullable<_Props[K]> extends object
                ?   NonNullable<_Props[K]> extends Extract<NonNullable<_Props[K]>, AnyFunc>
                    ?   _Props[K]
                    :   NewProps<NonNullable<_Props[K]>, _NewDefaults[K]>
                :   _Props[K]
        :   _Props[K]
}
& Omit<_Props, keyof _NewDefaults>




/**
 * Applies default props to a given Siegel component function,
 * so you don't need to apply them every time you use the component
 *
 * @param Component Siegel component function
 * @param newDefaults default props to apply
 * @returns Siegel component function with applied default props
 */
function withDefaults
<
    _ComponentWithDefaults extends CoreUIComponentWithDefaults<CoreUIComponent<any, any>>,
    _Props extends Parameters<_ComponentWithDefaults>[0],
    _NewDefaults extends DeepPartial<_Props>
>
(
    Component: _ComponentWithDefaults,
    newDefaults: _NewDefaults
) {

    const { ID, defaults } = Component

    const mergedDefaults = extractProps(
        defaults as _ComponentWithDefaults['defaults'],
        newDefaults
    )
    mergedDefaults._noMergeWithDefaults = true


    const componentWithDefaults = (props: NewProps<_Props, _NewDefaults>) => (
        <Component { ...extractProps(mergedDefaults, props) } />
    )

    componentWithDefaults.ID = ID
    componentWithDefaults.defaults = mergedDefaults


    return componentWithDefaults
}


export default withDefaults