import isExists from '../exists'


/**
 * Check if value is null or undefned
 *
 * @param val - Value to check
 * @returns true if value is undefined or null
 */
const isNullable = (val: any) => !isExists(val) || val === null


export default isNullable