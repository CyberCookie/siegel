import isNullable from '../nullable'


/**
 * Check if value is primitive and not nullable
 *
 * @param val - Value to check
 * @returns true if value is primitive
 */
const isPrimitive = (val: any) => {
    if (isNullable(val)) return true

    const { constructor } = val as object
    return constructor == Number ||
        constructor == String ||
        constructor == Boolean ||
        constructor == BigInt
}


export default isPrimitive