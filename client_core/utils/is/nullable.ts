import isExists from './exists'


const isNullable = (val: any) => !isExists(val) || val === null


export default isNullable