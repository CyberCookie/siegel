import isValidNumberString from './is_valid_number_string'

import type { Props } from '../types'


const initializePrevValidNumber = (value: Props['value'], numberValue: number) => (
    isValidNumberString(value, numberValue)
        ?   numberValue
        :   undefined
)


export default initializePrevValidNumber