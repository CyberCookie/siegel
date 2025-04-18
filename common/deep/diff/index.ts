import isPrimitive from '../../is/primitive'


type Comparable = any[] | Obj

type Options = {
    valueForEqualArrElement?: any
    valueForRemovedObjField?: any
    complexTypesIsEqual?: <T extends Obj>(a: T, b: T) => boolean
}

type ComparsionCallBacks = {
    valuesNotEqual(): void
    valuesIterable(result: ReturnType<typeof compare>): void
    valuesEqual?(): void
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


function compareObjects(a: Obj, b: Obj, options: Options) {
    const { valueForRemovedObjField } = options
    const result: Obj = {}
    let updatesCount = 0

    Object.entries(a)
        .forEach(([ a_key, a_value ]) => {
            if (Object.prototype.hasOwnProperty.call(b, a_key)) {
                const b_value = b[a_key]

                comparsionCallBacks(a_value, b_value, options, {
                    valuesIterable(nestedResult) {
                        if (nestedResult.updatesCount) {
                            result[a_key] = nestedResult.result
                            updatesCount++
                        }
                    },
                    valuesNotEqual() {
                        result[a_key] = b_value
                        updatesCount++
                    }
                })
            } else {
                result[a_key] = valueForRemovedObjField
                updatesCount++
            }
        })

    for (const key in b) {
        if (Object.prototype.hasOwnProperty.call(b, key)) {
            if (Object.prototype.hasOwnProperty.call(a, key)) continue
            else {
                result[key] = b[key]
                updatesCount++
            }
        }
    }


    return { result, updatesCount }
}

const compare = (a: Comparable, b: Comparable, options: Options) => (
    Array.isArray(a)
        ?   compareArrays(a, b as any[], options)
        :   compareObjects(a, b, options)
)


/**
 * Performs deep comparsion of any JSON like objects
 *
 * @param a Comparable object
 * @param b Object to compare with
 * @param options Options to help to resolve corner cases
 * @returns Diff result
 */
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