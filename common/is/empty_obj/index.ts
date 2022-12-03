function isEmptyObject(obj: Obj) {
    for (const k in obj) return false
    return true
}


export default isEmptyObject