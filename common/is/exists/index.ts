/**
 * Check if value is not undefined
 *
 * @param value - Value to check
 * @returns false if value is undefined
 */
const isExists = <T = any>(value: T): value is Exclude<T, undefined> => value !== void 0


export default isExists