/**
 * Sort function used as a callback in `Array.sort()` method
 * @param  object_a - previous object
 * @param  object_b - next object
 * @param  primaryKey - primary lookup key
 * @param  secondaryKey - secondary lookup key in case `object_a[primaryKey] == object_b[primaryKey]`
 * @param  sortValue - result in case `object_a` > `object_b`
 * @returns comparsion result as result of `Array.sort` callback
 */
function arrayObjSort(object_a: Indexable, object_b: Indexable,
    primaryKey: string, secondaryKey: string, sortValue: SortReturnValue = 1
) {
    const isBigger_a = object_a[primaryKey] == object_b[primaryKey]
        ?   object_a[secondaryKey] >= object_b[secondaryKey]
        :   object_a[primaryKey] > object_b[primaryKey]
    
    return isBigger_a ? sortValue : -sortValue
}


export default arrayObjSort