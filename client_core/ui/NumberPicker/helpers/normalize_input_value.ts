import isExists from '../../../../common/is/exists'


const CHAR_ZERO = '0'

function normalizeInputValue(value: string | undefined, precision: number | undefined, isFocused: boolean) {
    if(!isExists(value)) return

    const indexOfDot = value.indexOf('.')

    const firstNumberPos = value[0] == '-' ? 1 : 0
    let zeroesCount = 0
    if (value.length > (firstNumberPos + 1) && value[firstNumberPos] == CHAR_ZERO) {
        for (let i = firstNumberPos, l = indexOfDot >= 0 ? indexOfDot : value.length; i < l; i++) {
            if (value[i] == CHAR_ZERO && value[i + 1] != '.') zeroesCount++
            else break
        }

        zeroesCount && (value = value.replace(CHAR_ZERO.repeat(zeroesCount), ''))
    }


    if (precision && indexOfDot > -1) {
        const maxLength = indexOfDot + precision + 1
        value = value.length > maxLength
            ?   value.substring(0, maxLength)
            :   value.length < maxLength && !isFocused
                ?   (+value).toFixed(precision)
                :   value
    }


    return value
}


export default normalizeInputValue