import isNullable from './nullable'


const isPrimitive = (val: Object | null | undefined) => {
    if (isNullable(val)) return true

    const { constructor } = val as object
    return constructor === Number ||
        constructor === String ||
        constructor === Boolean ||
        constructor === BigInt
}


export default isPrimitive