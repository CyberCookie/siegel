import isExists from '../../../../common/is/exists'

import type { MergedProps } from '../types'


const isValidNumberMissingDigits = (value: MergedProps['value']) => {
    const stringValue = isExists(value) ? `${value}` : ''
    const [ firstChar, secondChar ] = stringValue

    return firstChar == '.' || (firstChar == '-' && secondChar == '.') || stringValue!.at(-1) == '.'
}


export default isValidNumberMissingDigits