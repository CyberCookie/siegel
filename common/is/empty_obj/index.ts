/**
 * Check if object is empty
 *
 * @param obj Value to check
 * @returns true if object is empty
 */
function isEmptyObject(obj: Obj) {
    for (const k in obj) return false
    return true
}


export default isEmptyObject