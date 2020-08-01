import { PropsComponentBase, CoreIUComponent } from '../ui_utils'
import dateParse from '../../utils/date/parse'


type Props = {
    initDate: Date
    zeroing?: boolean
    incrementEveryMinute?: boolean
    speedCoef?: number
    builder?: (dateParsed: ReturnType<typeof dateParse>) => React.ReactNode
} & PropsComponentBase

type DefaultProps = {
    speedCoef: NonNullable<Props['speedCoef']>
    incrementEveryMinute: NonNullable<Props['incrementEveryMinute']>
    zeroing: NonNullable<Props['zeroing']>
} & PropsComponentBase

type _Clocks = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Clocks }