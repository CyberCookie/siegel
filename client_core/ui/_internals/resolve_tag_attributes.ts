import type { CoreUIReactTagAttributes } from '../_internals/types'


type MergeReactTagAttributes = <
    A extends ReactTagAttributes<any>,
    B extends CoreUIReactTagAttributes<any>
>(
    defaultAttributes: A,
    newAttributes: B | undefined
) => A


const resolveTagAttributes: MergeReactTagAttributes = (defaultAttributes, newAttributes) => {
    type NewAttrFuncCb = Extract<NonNullable<typeof newAttributes>, AnyFunc>
    type ExpectedResult = typeof defaultAttributes


    return newAttributes
        ?   newAttributes.constructor == Function
            ?   (newAttributes as NewAttrFuncCb)(defaultAttributes) as ExpectedResult
            :   Object.assign(defaultAttributes, newAttributes)
        :   defaultAttributes
}


export default resolveTagAttributes