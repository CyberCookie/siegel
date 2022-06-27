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

const isSameType = (a: any, b: any) => (
    getValueConstructor(a) == getValueConstructor(b)
)


export default isSameType