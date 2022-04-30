type QueryValue = string | number | boolean

type UpdateURLQuery = {
    (
        key: string | Indexable,
        value: QueryValue
    ): URLSearchParams
}


function updateQuery(query: URLSearchParams, key: string, value: QueryValue) {
    value === '' ? query.delete(key) : query.set(key, (value as string))
}

const updateURLQuery: UpdateURLQuery = function(key, value) {
    const { search, pathname } = location

    const query = new URLSearchParams(search)

    if (typeof key == 'string') updateQuery(query, key, value)
    else for (const searchKey in key) updateQuery(query, searchKey, key[searchKey])

    history.replaceState({}, '', `${pathname}?${query}`)


    return query
}


export default updateURLQuery
export type { UpdateURLQuery }