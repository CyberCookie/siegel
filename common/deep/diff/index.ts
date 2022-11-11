import isPrimitive from '../../is/primitive'


type Comparable = any[] | Indexable

type Options = {
    valueForEqualArrElement?: any
    valueForRemovedObjField?: any
    complexTypesIsEqual?: <T extends Indexable>(a: T, b: T) => boolean
}

type ComparsionCallBacks = {
    valuesNotEqual(): void
    valuesIterable(result: ReturnType<typeof compare>): void
    valuesEqual?: () => void
}



const SYMBOL__VALUES_EQUAL = Symbol.for('equal')
const SYMBOL__OBJECT_FIELD_REMOVED = Symbol.for('removed')

const isIterable = (val: Comparable) => Array.isArray(val) || val.constructor == Object

function comparsionCallBacks(
    a_val: any,
    b_val: any,
    options: Options,
    { valuesIterable, valuesNotEqual, valuesEqual }: ComparsionCallBacks
) {

    const isPrimitive_a = isPrimitive(a_val)
    const isPrimitive_b = isPrimitive(b_val)

    if (isPrimitive_a || isPrimitive_b) {
        isPrimitive_a && isPrimitive_b
            ?   a_val === b_val
                ?   valuesEqual?.()
                :   valuesNotEqual()
            :   valuesNotEqual()

    } else if (b_val.constructor == a_val.constructor) {
        if (isIterable(a_val)) {
            valuesIterable( compare(a_val, b_val, options) )

        } else if (options.complexTypesIsEqual) {
            options.complexTypesIsEqual(a_val, b_val)
                ?   valuesEqual?.()
                :   valuesNotEqual()

        } else valuesNotEqual()
    } else valuesNotEqual()
}

function compareArrays(a: any[], b: any[], options: Options) {
    const { valueForEqualArrElement } = options
    const result: any[] = []
    let updatesCount = 0

    b.forEach((b_val, i) => {
        if (i < a.length) {

            let elToPush
            comparsionCallBacks(a[i], b_val, options, {
                valuesIterable(nestedResult) {
                    elToPush = nestedResult.updatesCount
                        ?   nestedResult.result
                        :   valueForEqualArrElement
                },
                valuesNotEqual() {
                    elToPush = b_val
                },
                valuesEqual() {
                    elToPush = valueForEqualArrElement
                }
            })

            elToPush === valueForEqualArrElement || updatesCount++
            result.push(elToPush)

        } else {
            result.push(b_val)
            updatesCount++
        }
    })

    b.length < a.length && updatesCount++


    return { result, updatesCount }
}


function compareObjects(a: Indexable, b: Indexable, options: Options) {
    const { valueForRemovedObjField } = options
    const result = {} as Indexable
    let updatesCount = 0

    for (const key in a) {
        if (key in b) {
            const b_val = b[key]

            comparsionCallBacks(a[key], b_val, options, {
                valuesIterable(nestedResult) {
                    if (nestedResult.updatesCount) {
                        result[key] = nestedResult.result
                        updatesCount++
                    }
                },
                valuesNotEqual() {
                    result[key] = b_val
                    updatesCount++
                }
            })
        } else {
            result[key] = valueForRemovedObjField
            updatesCount++
        }
    }

    for (const key in b) {
        if (key in a) continue
        else {
            result[key] = b[key]
            updatesCount++
        }
    }


    return { result, updatesCount }
}

const compare = (a: Comparable, b: Comparable, options: Options) => (
    Array.isArray(a)
        ?   compareArrays(a, b as any[], options)
        :   compareObjects(a, b, options)
)


function diff(a: Comparable, b: Comparable, options = {} as Options) {
    if (a.constructor == b.constructor) {
        if (isIterable(a)) {
            options.valueForEqualArrElement ||= SYMBOL__VALUES_EQUAL
            options.valueForRemovedObjField ||= SYMBOL__OBJECT_FIELD_REMOVED

            const { result, updatesCount } = compare(a, b, options)
            return updatesCount ? result : SYMBOL__VALUES_EQUAL

        } else {
            return options.complexTypesIsEqual
                ?   options.complexTypesIsEqual(a, b) ? SYMBOL__VALUES_EQUAL : b
                :   b
        }
    } else return b
}


export default diff
export { SYMBOL__VALUES_EQUAL, SYMBOL__OBJECT_FIELD_REMOVED }