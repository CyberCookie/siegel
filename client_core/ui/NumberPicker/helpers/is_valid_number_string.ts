import isExists from '../../../../common/is/exists'

import type { MergedProps } from '../types'


const isValidNumberString = (value: MergedProps['value'], numberValue: number) => {
    const stringValue = isExists(value) ? `${value}` : ''

    return !isNaN(numberValue)
        &&  stringValue[ stringValue[0] == '-' ? 1 : 0 ] != '.'
        &&  stringValue.at(-1) != '.'
}


export default isValidNumberString