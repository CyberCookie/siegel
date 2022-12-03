import isExists from '../../is/exists'


type Key = string | number


function deepSet(iterable: any[] | Obj, path: Key[] | Key, value: any): void {
    let link: Obj = iterable
    const pathSequence = Array.isArray(path) ? path : [ path ]

    for (let i = 0, l = pathSequence.length; i < l; i++) {
        const pathPart = pathSequence[i]

        if (i == l - 1) {
            link[pathPart] = value
        } else {
            if (!isExists(link[pathPart])) {
                link[pathPart] = typeof pathSequence[i + 1] == 'number' ? [] : {}
            }

            link = link[pathPart]
        }
    }
}


export default deepSet