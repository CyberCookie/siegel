type QueryValue = string | number | boolean

type UpdateURLQuery = {
    (
        history: {
            replace(path: string, state?: any): void
        },
        key: string | Indexable,
        value: QueryValue
    ): void
}


/**
 * Mutates the URL search params
 * @param history - object created by `createHistory` method of `history` pckg
 * @param key - or map of key value pairs to set into search string
 * @param value to set if `key` is string. otherwice ignored
 */

function updateQuery(query: URLSearchParams, key: string, value: QueryValue) {
    value === '' ? query.delete(key) : query.set(key, (value as string))
}

const updateURLQuery: UpdateURLQuery = function(history, key, value) {
    const { pathname, search } = window.location;
    const query = new URLSearchParams(search)

    if (typeof key == 'string') updateQuery(query, key, value)
    else for (const searchKey in key) updateQuery(query, searchKey, key[searchKey])

    
    history.replace(pathname + '?' + query.toString())
}


export default updateURLQuery
export type { UpdateURLQuery }