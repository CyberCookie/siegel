import isValidNumberMissingDigits from './is_valid_number_missing_digits'

import type { MergedProps } from '../types'


const isValidNumberString = (value: MergedProps['value']) => (
    value !== '' && !(isNaN(value) || isValidNumberMissingDigits(value))
)


export default isValidNumberString