function isEmptyObject(obj: Indexable) {
    for (const k in obj) return false
    return true
}


export default isEmptyObject