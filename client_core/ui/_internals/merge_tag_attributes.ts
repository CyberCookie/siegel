import isNullable from '../../../common/is/nullable'

import type { ReactTagAttributes, CoreUIReactTagAttributes } from '../_internals/types'


type MergeRecursive = (
    defaultAttributes: ReactTagAttributes & Indexable,
    newAttributes: ReactTagAttributes & Indexable
) => ReactTagAttributes

type MergeReactTagAttributes = <
    A extends ReactTagAttributes<any>,
    B extends CoreUIReactTagAttributes<any>
>(
    defaultAttributes: A,
    newAttributes: B
) => A


const mergeRecursive: MergeRecursive = (defaultAttributes, newAttributes) => {
    for (const key in newAttributes) {
        const defaultValue = defaultAttributes[key]
        const newValue = newAttributes[key]

        if (
            key in defaultAttributes
            &&  !isNullable(defaultValue) && !isNullable(newValue)
            &&  defaultValue.constructor === newValue.constructor
        ) {

            if (defaultValue.constructor === Object) {
                return mergeRecursive(defaultValue, newValue)

            } else if (defaultValue.constructor === Function) {
                defaultAttributes[key] = (...args: any[]) => {
                    const newFuncResult = newValue(...args)
                    newFuncResult && defaultValue(...args)
                }

            } else defaultAttributes[key] = newValue

        } else defaultAttributes[key] = newValue
    }

    return defaultAttributes
}

const mergeTagAttributes: MergeReactTagAttributes = (defaultAttributes, newAttributes) => (
    newAttributes.constructor === Function
        ?   (newAttributes as Function)(defaultAttributes)
        :   mergeRecursive(defaultAttributes, newAttributes as ReactTagAttributes)
)


export default mergeTagAttributes