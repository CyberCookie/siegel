type UpdateURLQueryParams = {
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
const updateURLQueryParams: UpdateURLQueryParams = function(history, key, value) {
    let { pathname, search } = window.location;

    let query = new URLSearchParams(search)

    if (typeof key == 'string') {
        query.set(key, <string>value)
    } else {
        for (let searchKey in key) {
            query.set(searchKey, key[searchKey])
        }
    }

    history.replace(pathname + '?' + query.toString())
}


export { UpdateURLQueryParams }
export default updateURLQueryParams