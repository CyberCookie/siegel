import isExists from '../exists'


/**
 * Check if value is null or undefned
 *
 * @param val - Value to check
 * @returns true if value is undefined or null
 */
const isNullable = <T = any>(value: T): value is Extract<T, undefined | null> => (
    !isExists(value) || value === null
)


export default isNullable