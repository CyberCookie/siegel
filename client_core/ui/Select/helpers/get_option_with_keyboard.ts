import type { MergedProps } from '../types'


function getOptionWithKeyboard(
    options: MergedProps['options'],
    currentIndex: number,
    incrementValue: number
) {

    const length = options.length
    const maxIndex = length - 1
    const isUp = incrementValue < 0

    let startFrom = currentIndex + incrementValue
    startFrom = startFrom < 0
        ?   length - 1
        :   startFrom >= length ? 0 : startFrom

    for (let i = startFrom; 0 <= i && i < length; i += incrementValue) {
        if (!options[i].disabled) return i

        if (isUp) {
            i == 0 && (i = maxIndex)
        } else i == maxIndex && (i = -1)
    }
}


export default getOptionWithKeyboard