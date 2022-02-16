import type { DateParse } from '../../utils/date/parse'
import type { PropsComponentBase, CoreIUComponent } from '../_internals/types'


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

type DefaultProps = {
    speedCoef: NonNullable<Props['speedCoef']>
    tickEveryMinute: NonNullable<Props['tickEveryMinute']>
    zeroing: NonNullable<Props['zeroing']>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }