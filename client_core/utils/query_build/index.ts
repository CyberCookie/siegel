import isNullable from '../../../common/is/nullable'


type QueryValue = string | number | boolean

type BuildURLQuery = {
    (
        key: string | Obj<QueryValue>,
        value?: QueryValue
    ): URLSearchParams
}


function buildQueryPart(query: URLSearchParams, key: string, value: QueryValue | undefined) {
    isNullable(value)
        ?   query.delete(key)
        :   query.set(key, (value as string))
}

/**
 * Returns updated URL search query
 *
 * @param key - Query param key. Or object with keys as query params and valuest as query param values
 * @param value - Query param value
 * @returns String query params
 */
const buildURLQuery: BuildURLQuery = function(key, value) {
    const { search } = location

    const query = new URLSearchParams(search)


    if (typeof key == 'string') buildQueryPart(query, key, value)
    else {
        Object.entries(key)
            .forEach(([ searchKey, searchValue ]) => {
                buildQueryPart(query, searchKey, searchValue)
            })
    }


    return query
}


export default buildURLQuery
export type { BuildURLQuery }