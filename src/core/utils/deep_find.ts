type LookupFn = (elem: any) => boolean


/**
 * Loop over array of objects `arr` to find object by given condition function `fn`.
 * If fails tries again but loop over `arr[key]` array
 * @param fn - callback function that executes recursively on every `arr`
 * entry until return `true`
 * @param obj - object where to find
 * @param key - object property key to recursively dive into `obj`
 * @returns desired object by `fn` condition or undefined
*/
function deepFind
<K extends string, T extends IndexObjectKeys<K, T[]>>
(fn: LookupFn, obj: T, key: K): T | void {

    let seekIn = obj[key]

    for (var i = 0, l = seekIn.length; i < l; i++) {
        let elem = seekIn[i]

        if (fn(elem)) return elem;

        if (elem[key]) {
            let result = deepFind(fn, elem, key)
            if (result) return result
        }
    }
}


export default deepFind