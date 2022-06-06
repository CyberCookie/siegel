import type { DateParse } from '../../utils/date/parse'
import type { PropsComponentBase, CoreUIComponent } from '../_internals/types'


type Props = Omit<
    PropsComponentBase<{
        initDate: Date
        zeroing?: boolean
        tickEveryMinute?: boolean
        speedCoef?: number
        backward?: boolean
        builder?(dateParsed: ReturnType<DateParse>): React.ReactNode
    }>,
    'refApi'
>

type DefaultProps = NonNullableKeys<{
    speedCoef: Props['speedCoef']
    tickEveryMinute: Props['tickEveryMinute']
    zeroing: Props['zeroing']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, Component }