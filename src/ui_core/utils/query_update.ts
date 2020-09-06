type UpdateURLQuery = {
    (
        history: {
            replace: (path: string, state?: any) => void
        },
        key: string | Indexable,
        value: string | number | boolean
    ): void
}


/**
 * Mutates the URL search params
 * @param history - object created by `createHistory` method of `history` pckg
 * @param key - or map of key value pairs to set into search string
 * @param value to set if `key` is string. otherwice ignored
 */
const updateURLQuery: UpdateURLQuery = function(history, key, value) {
    const { pathname, search } = window.location;
    const query = new URLSearchParams(search)

    if (typeof key == 'string') {
        query.set(key, (value as string))
    } else {
        for (const searchKey in key) {
            query.set(searchKey, key[searchKey])
        }
    }

    history.replace(pathname + '?' + query.toString())
}


export { UpdateURLQuery }
export default updateURLQuery