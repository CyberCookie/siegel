import FastSet from '../../FastSet'


function deduplicate<T extends number | string>(arr: T[]) {
    const added = new FastSet()
    const result: T[] = []

    for (let i = 0, l = arr.length; i < l; i++) {
        const val = arr[i]

        if (!added.has(val)) {
            result.push(val)
            added.add(val)
        }
    }


    return result
}


export default deduplicate