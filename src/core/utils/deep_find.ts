type lookupFn = (elem: lookupObject) => boolean

interface lookupObject {
    [key: string]: lookupObject[]
}


/**
 * Loop over array of objects `arr` to find object by given condition function `fn`.
 * If fails tries again but loop over `arr[key]` array
 * @param {conditionCallback} fn - callback function that executes recursively on every `arr`
 * entry until return `true`
 * @param {object[]} obj - object where to find
 * @param {string} key - object property key to recursively dive into `obj`
*/
function deepFind(fn: lookupFn, obj: lookupObject, key: Indexer): any {
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