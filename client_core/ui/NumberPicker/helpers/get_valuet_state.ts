import getInputString from './get_input_string'
import isValidNumberString from './is_valid_number_string'

import type { MergedProps } from '../types'


function getValueState(
    props: MergedProps,
    numberValue: number,
    numberMask: RegExp,
    isFocused: boolean
) {

    const prevValidNumber = isValidNumberString(props.value) ? numberValue : undefined
    return {
        prevValidNumber,
        stringValue: getInputString({
            props, numberValue, numberMask, isFocused, prevValidNumber
        })
    }
}


export default getValueState