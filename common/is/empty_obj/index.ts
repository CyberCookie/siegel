/**
 * Check if object is empty
 *
 * @param obj - Value to check
 * @returns true if object is empty
 */
const isEmptyObject = (obj: Obj) => Object.keys(obj).length == 0


export default isEmptyObject