import extractProps from './_internals/props_extract'
import type { CoreIUComponent } from './_internals/types'


function withDefaults
<
    C extends CoreIUComponent<any, any>,
    Props extends Parameters<C>[0],
    NewDefaults extends Partial<Props>
>
(Component: C, newDefaults: NewDefaults) {
    const { ID, defaults } = Component
    const mergedDefaults = extractProps(defaults, newDefaults, false)

    const componentWithDefaults = (props: PartialKeys<Props, keyof NewDefaults>) => (
        Component(
            extractProps(mergedDefaults, props, true)
        )
    )
    componentWithDefaults.ID = ID


    return componentWithDefaults
}


export default withDefaults