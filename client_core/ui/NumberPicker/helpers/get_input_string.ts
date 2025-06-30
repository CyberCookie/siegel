import isExists from '../../../../common/is/exists'

import pretifyInputString from './pretify_input_string'

import type { MergedProps } from '../types'


type Params = {
    props: MergedProps
    isFocused: boolean
    numberValue: number
    prevValidNumber: number | undefined
    numberMask: RegExp
}


const CHAR_ZERO = '0'
const CHAR_DOT = '.'

function getInputString(params: Params) {
    if (isExists(params.props.value)) {
        const {
            props: { value, precision, zeroesPadLeft },
            isFocused, numberMask, prevValidNumber
        } = params

        let { numberValue } = params
        let isNumberNaN = isNaN(numberValue)
        if (isNumberNaN && !isFocused && isExists(prevValidNumber) && !isNaN(prevValidNumber)) {
            numberValue = prevValidNumber
            isNumberNaN = false
        }



        let result = typeof value == 'string' && numberMask.test(value)
            ?   pretifyInputString(value)
            :   isNumberNaN ? '' : `${numberValue}`


        if (result) {
            let indexOfDot: number | undefined
            if (!isNumberNaN && isExists(precision)) {
                let isPrecisionAdjust = true
                if (isFocused) {
                    indexOfDot = result.indexOf(CHAR_DOT)
                    isPrecisionAdjust = indexOfDot >= 0 && ((result.length - 1) - indexOfDot) > precision
                }

                if (isPrecisionAdjust) {
                    result = numberValue.toFixed(precision)
                    isFocused && (result = `${+result}`)
                }
            }


            if (!isFocused) {
                const lastChar = result.at(-1)
                lastChar == CHAR_DOT && (result = result.substring(0, result.length - 1))


                if (zeroesPadLeft! > 0) {
                    const firstChar = result[0]
                    const isNegative = firstChar == '-'

                    const zeroPadIndexOfDot = isExists(indexOfDot)
                        ?   indexOfDot
                        :   result.indexOf(CHAR_DOT)

                    const padStartIndex = isNegative ? 1 : 0
                    const padEndIndex = zeroPadIndexOfDot! >= 0
                        ?   zeroPadIndexOfDot
                        :   result.length

                    const curPadLength = padEndIndex! - padStartIndex

                    if (curPadLength < zeroesPadLeft!) {
                        const extraZeroes = CHAR_ZERO.repeat(zeroesPadLeft! - curPadLength)
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