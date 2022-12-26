import type { DateParse } from '../../../common/date/parse'
import type { PropsComponentBase, CoreUIComponent } from '../_internals/types'


type Props = Omit<
    PropsComponentBase<{
        /** Clocks initial value */
        initDate?: Date

        /** Makes builder's parsed date values prefixed with zero */
        zeroing?: boolean

        /** Recalculates clocks value every clock minute */
        tickEveryMinute?: boolean

        /** Changed clock ticking speed. Default is 1 */
        speedCoef?: number

        /** Whether to tick backward */
        backward?: boolean

        /**
         * Callback to construct clocks display value
         *
         * @param dateParsed result of date/parse util
         */
        builder?(dateParsed: ReturnType<DateParse>): React.ReactNode
    }>,
    'refApi'
>

type DefaultProps = NonNullableProps<{
    speedCoef: Props['speedCoef']
    tickEveryMinute: Props['tickEveryMinute']
    zeroing: Props['zeroing']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, Component }