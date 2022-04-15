import type { MergedProps } from '../types'


function stringToNumberValue(
    value: MergedProps['value'],
    min: MergedProps['min'],
    max: MergedProps['max']
) {

    const numberFloat = parseFloat(value as string)

    return isNaN(numberFloat)
        ?   isFinite(min)
            ?   min
            :   isFinite(max) ? max : 0
        :   numberFloat
}


export default stringToNumberValue