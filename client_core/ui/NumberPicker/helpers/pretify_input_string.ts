import isExists from '../../../../common/is/exists'


const CHAR_ZERO = '0'
const CHAR_DOT = '.'

const pretifyInputString = (value: string) => {
    const stringCommaReplaced = value.replace(',', CHAR_DOT)

    const firstChar = stringCommaReplaced[0]

    let numberPrefix = ''
    let startFrom = 0
    if (firstChar == '-') {
        numberPrefix = firstChar
        startFrom = 1
    }


    if (value[startFrom] == CHAR_ZERO) {
        const nextChar = value[startFrom + 1]
        if (nextChar == CHAR_DOT || !isExists(nextChar)) {
            return stringCommaReplaced

        } else {
            let replaceString = ''
            let suffix = ''
            for (let i = startFrom, l = stringCommaReplaced.length; i < l; i++) {
                if (stringCommaReplaced[i] == CHAR_ZERO) replaceString += CHAR_ZERO
                else {
                    suffix = stringCommaReplaced[i]
                    break
                }
            }

            return suffix == CHAR_DOT || !suffix
                ?   numberPrefix + CHAR_ZERO + suffix
                :   stringCommaReplaced.replace(
                        numberPrefix + replaceString + suffix,
                        numberPrefix + suffix
                    )
        }

    } else return stringCommaReplaced
}


export default pretifyInputString