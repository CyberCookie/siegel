import isNullable from '../nullable'
import isExists from '../exists'


const SYMBOL_UNDEF_CONSTRUCTOR = Symbol('undef')
const SYMBOL_NULL_CONSTRUCTOR = Symbol('null')


const getValueConstructor = (value: any) => (
    isNullable(value)
        ?   isExists(value)
            ?   SYMBOL_NULL_CONSTRUCTOR
            :   SYMBOL_UNDEF_CONSTRUCTOR
        :   value.constructor.name
)

/**
 * Check if both values have the same type
 *
 * @param a - Comparable value
 * @param b - Value to compare with
 * @returns true if values have the same type
 */
const isSameType = (a: any, b: any) => (
    getValueConstructor(a) == getValueConstructor(b)
)


export default isSameType