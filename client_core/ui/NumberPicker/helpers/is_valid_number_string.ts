import isValidNumberMissingDigits from './is_valid_number_missing_digits'

import type { MergedProps } from '../types'


const isValidNumberString = (value: MergedProps['value'], numberValue: number) => (
    !(isNaN(numberValue) || isValidNumberMissingDigits(value))
)


export default isValidNumberString