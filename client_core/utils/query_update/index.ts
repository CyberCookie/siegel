import isExists from '../../../common/is/exists'


type QueryValue = string | number | boolean

type UpdateURLQuery = {
    (
        key: string | Obj<QueryValue>,
        value?: QueryValue
    ): URLSearchParams
}


function updateQuery(query: URLSearchParams, key: string, value: QueryValue | undefined) {
    value === '' || !isExists(value)
        ?   query.delete(key)
        :   query.set(key, (value as string))
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