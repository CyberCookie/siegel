import type { MergedProps } from '../types'


const stringToNumberValue = (value: MergedProps['value']) => (
    typeof value == 'number'
        ?   value
        :   parseFloat(value)
)


export default stringToNumberValue