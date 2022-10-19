import isExists from '../../../../common/is/exists'

import pretifyInputString from './pretify_input_string'

import type { MergedProps } from '../types'


type Params = {
    props: MergedProps
    isFocused: boolean
    numberValue: number
    numberMask: RegExp
}


function getInputString(params: Params) {
    if (isExists(params.props.value)) {
        const {
            props: { value, precision, zeroesPadLeft },
            isFocused, numberValue, numberMask
        } = params


        const isNumberNaN = isNaN(numberValue)

        let result = typeof value == 'string' && numberMask.test(value)
            ?   pretifyInputString(value)
            :   isNumberNaN ? '' : `${numberValue}`


        if (result && !isFocused) {
            const lastChar = result.at(-1)
            lastChar == '.' && (result = result.replace(lastChar, ''))

            !isNumberNaN && precision && (result = numberValue.toFixed(precision))
            if (zeroesPadLeft) {

                const firstChar = result[0]
                const indexOfDot = result.indexOf('.')
                const isNegative = firstChar == '-'

                const padStartIndex = isNegative ? 1 : 0
                const padEndIndex = indexOfDot >= 0
                    ?   indexOfDot
                    :   result.length

                const curPadLength = padEndIndex - padStartIndex

                if (curPadLength < zeroesPadLeft) {
                    const extraZeroes = ('0').repeat(zeroesPadLeft - curPadLength)
                    result = result.replace(
                        firstChar,
                        isNegative
                            ?   `${firstChar}${extraZeroes}`
                            :   `${extraZeroes}${firstChar}`
                    )
                }
            }
        }


        return result
    }
}


export default getInputString