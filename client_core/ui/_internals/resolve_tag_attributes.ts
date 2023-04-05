import type { CoreUIReactTagAttributes } from '../_internals/types'


type MergeReactTagAttributes = <
    A extends ReactTagAttributes<any>,
    B extends CoreUIReactTagAttributes<any>
>(
    defaultAttributes: A,
    newAttributes: B | undefined
) => A


const resolveTagAttributes: MergeReactTagAttributes = (defaultAttributes, newAttributes) => (
    newAttributes
        ?   newAttributes.constructor == Function
            ?   (newAttributes as Function)(defaultAttributes)
            :   Object.assign(defaultAttributes, newAttributes)
        :   defaultAttributes
)


export default resolveTagAttributes