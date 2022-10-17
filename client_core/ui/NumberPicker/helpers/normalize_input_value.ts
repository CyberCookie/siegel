import isExists from '../../../../common/is/exists'

import pretifyInputString from './pretify_input_string'

import type { MergedProps } from '../types'


type Params = {
    value: MergedProps['value']
    precision: MergedProps['precision']
    isFocused: boolean
    numberValue: number
    numberMask: RegExp
}


function getInputString(params: Params) {
    if (isExists(params.value)) {
        const { value, precision, isFocused, numberValue, numberMask } = params

        const isValueNaN = isNaN(numberValue)
        const notFocused = !isFocused

        if (precision && notFocused) {
            return isValueNaN ? '' : numberValue.toFixed(2)

        } else if (typeof value == 'string' && numberMask.test(value)) {
            const valueZeroesStripped = pretifyInputString(value)
            const lastChar = valueZeroesStripped.at(-1)

            return notFocused && lastChar == '.'
                ?   valueZeroesStripped.replace(lastChar, '')
                :   valueZeroesStripped
        }

        return isValueNaN ? '' : `${numberValue}`
    }
}


export default getInputString