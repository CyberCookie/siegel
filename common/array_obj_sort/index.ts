function arrayObjSort(
    primaryKey: string, secondaryKey: string, sortValue = 1,
    object_a: Obj, object_b: Obj
) {
    const isBigger_a = object_a[primaryKey] == object_b[primaryKey]
        ?   object_a[secondaryKey] >= object_b[secondaryKey]
        :   object_a[primaryKey] > object_b[primaryKey]

    return isBigger_a ? sortValue : -sortValue
}


export default arrayObjSort