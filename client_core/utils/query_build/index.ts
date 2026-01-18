import isNullable from '../../../common/is/nullable'


type QueryValuePrimitives = string | number | boolean
type QueryValue = QueryValuePrimitives | QueryValuePrimitives[]

type BuildURLQuery = {
    (
        key: string | Obj<QueryValue>,
        value?: QueryValue
    ): URLSearchParams
}


function buildQueryPart(query: URLSearchParams, key: string, value: QueryValue | undefined) {
    if (isNullable(value)) {
        query.delete(key)

    } else if (Array.isArray(value)) {
        query.delete(key)
        value.forEach(arrayValue => {
            query.append(key, arrayValue)
        })

    } else {
        query.set(key, (value as string))
    }
}

/**
 * Returns updated URL search query
 *
 * @param key - Query param key. Or object with keys as query params and valuest as query param values
 * @param value - Query param value
 * @returns String query params
 */
const buildURLQuery: BuildURLQuery = function(key, value) {
    const query = new URLSearchParams(location.search)

    if (typeof key == 'string') {
        buildQueryPart(query, key, value)

    } else {
        Object.entries(key)
            .forEach(([ searchKey, searchValue ]) => {
                buildQueryPart(query, searchKey, searchValue)
            })
    }


    return query
}


export default buildURLQuery
export type { BuildURLQuery }