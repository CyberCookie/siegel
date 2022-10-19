import type { MergedProps } from '../types'


const adjustWithRanges = (
    value: number,
    min: MergedProps['min'],
    max: MergedProps['max']
) => (

    value < min
        ?   min
        :   value > max ? max : value
)


export default adjustWithRanges