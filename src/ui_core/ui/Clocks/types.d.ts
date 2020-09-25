import type { PropsComponentBase, CoreIUComponent } from '../ui_utils'
import type { DateParse } from '../../utils/date/parse'


type Props = {
    initDate: Date
    zeroing?: boolean
    incrementEveryMinute?: boolean
    speedCoef?: number
    builder?: (dateParsed: ReturnType<DateParse>) => React.ReactNode
} & PropsComponentBase

type DefaultProps = {
    speedCoef: NonNullable<Props['speedCoef']>
    incrementEveryMinute: NonNullable<Props['incrementEveryMinute']>
    zeroing: NonNullable<Props['zeroing']>
} & PropsComponentBase

type _Clocks = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, _Clocks }