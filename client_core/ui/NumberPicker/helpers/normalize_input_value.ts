import isExists from '../../../../common/is/exists'

import type { MergedProps } from '../types'


type Params = {
    value: MergedProps['value']
    precision: MergedProps['precision']
    isFocused: boolean
    numberValue: number
    numberMask: RegExp
}


function getInputString(params: Params) {
    if(isExists(params.value)) {
        const { value, precision, isFocused, numberValue, numberMask } = params

        const isValueNaN = isNaN(numberValue)

        return precision && !isFocused
            ?   isValueNaN ? '' : numberValue.toFixed(2)
            :   typeof value == 'string' && numberMask.test(value)
                ?   value
                :   isValueNaN ? '' : `${numberValue}`
    }
}


export default getInputString