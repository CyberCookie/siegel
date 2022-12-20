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
            props: { value, precision, zeroesPadLeft, precisionKeepZeroes },
            isFocused, numberValue, numberMask
        } = params


        const isNumberNaN = isNaN(numberValue)

        let result = typeof value == 'string' && numberMask.test(value)
            ?   pretifyInputString(value)
            :   isNumberNaN ? '' : `${numberValue}`


        if (result) {
            let indexOfDot: number | undefined
            if (!isNumberNaN && isExists(precision)) {
                let isPrecisionAdjust = true
                if (isFocused) {
                    indexOfDot = result.indexOf('.')
                    isPrecisionAdjust = indexOfDot >= 0 && ((result.length - 1) - indexOfDot) > precision
                }

                isPrecisionAdjust && (result = numberValue.toFixed(precision))

                if (!(isFocused || precisionKeepZeroes)) {
                    result = `${numberValue}`
                }
            }


            if (!isFocused) {
                const lastChar = result.at(-1)
                lastChar == '.' && (result = result.replace(lastChar, ''))


                if (zeroesPadLeft! > 0) {
                    const firstChar = result[0]
                    const isNegative = firstChar == '-'

                    const zeroPadIndexOfDot = isExists(indexOfDot)
                        ?   indexOfDot
                        :   result.indexOf('.')

                    const padStartIndex = isNegative ? 1 : 0
                    const padEndIndex = zeroPadIndexOfDot! >= 0
                        ?   zeroPadIndexOfDot
                        :   result.length

                    const curPadLength = padEndIndex! - padStartIndex

                    if (curPadLength < zeroesPadLeft!) {
                        const extraZeroes = '0'.repeat(zeroesPadLeft! - curPadLength)
                        result = result.replace(
                            firstChar,
                            isNegative
                                ?   `${firstChar}${extraZeroes}`
                                :   `${extraZeroes}${firstChar}`
                        )
                    }
                }
            }
        }


        return result
    }
}


export default getInputString