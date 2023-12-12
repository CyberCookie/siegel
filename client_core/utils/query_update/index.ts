import isNullable from '../../../common/is/nullable'


type QueryValue = string | number | boolean

type UpdateURLQuery = {
    (
        key: string | Obj<QueryValue>,
        value?: QueryValue
    ): URLSearchParams
}


function updateQuery(query: URLSearchParams, key: string, value: QueryValue | undefined) {
    isNullable(value)
        ?   query.delete(key)
        :   query.set(key, (value as string))
}

/**
 * Returns updated URL search query
 *
 * @param key query param key. Or object with keys as query params and valuest as query param values
 * @param value query param value
 * @returns String query params
 */
const updateURLQuery: UpdateURLQuery = function(key, value) {
    const { search } = location

    const query = new URLSearchParams(search)

    if (typeof key == 'string') updateQuery(query, key, value)
    else for (const searchKey in key) updateQuery(query, searchKey, key[searchKey])


    return query
}


export default updateURLQuery
export type { UpdateURLQuery }