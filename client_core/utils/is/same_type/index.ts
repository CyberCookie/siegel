import isNullable from '../nullable'


const SYMBOL_UNDEF_CONSTRUCTOR = Symbol('undef')
const SYMBOL_NULL_CONSTRUCTOR = Symbol('null')


const getValueConstructor = (value: any) => (
    isNullable(value)
        ?   value === undefined
            ?   SYMBOL_UNDEF_CONSTRUCTOR
            :   SYMBOL_NULL_CONSTRUCTOR
        :   value.constructor.name
)

const isSameType = (a: any, b: any) => (
    getValueConstructor(a) == getValueConstructor(b)
)


export default isSameType