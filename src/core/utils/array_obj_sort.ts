type SortValue = -1 | 1


/**
 * Sort function used as a callback in `Array.sort()` method
 * @param  {Indexable} object_a - previous object
 * @param  {Indexable} object_b - next object
 * @param  {string} primaryKey - primary lookup key
 * @param  {string} secondaryKey - secondary lookup key in case `object_a[primaryKey] == object_b[primaryKey]`
 * @param  {SortValue} sortValue - result in case object_a > object_b
 * @return {SortValue} comparsion result as result of `Array.sort` callback
 */
const arrayObjSort = (object_a: Indexable, object_b: Indexable,
    primaryKey: string, secondaryKey: string, sortValue: SortValue = 1
) => (
    object_a[primaryKey] == object_b[primaryKey]
        ?   object_a[secondaryKey] >= object_b[secondaryKey]
            ?   sortValue
            :   -sortValue
        
        :   object_a[primaryKey] > object_b[primaryKey]
            ?   sortValue
            :   -sortValue
)


export default arrayObjSort