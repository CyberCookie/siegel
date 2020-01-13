import { PropsComponentThemed } from '../ui_utils'


type ActiveDateRange = {
    rangeDateStart: number,
    rangeDateEnd?: number
}

type Props = {
    activeDate: ActiveDateRange,
    prevIcon?: React.ReactNode,
    nextIcon?: React.ReactNode,
    monthsBefore?: number,
    monthsAfter?: number,
    missedRow?: '' | 'placeholder' | 'filled',
    weekStartsFrom?: 1 | 2 | 3 | 4 | 5 | 6,
    noControlls?: boolean,
    triggerOnlyWhenFinished?: boolean,
    locale?: string
    onDateRangePick: (range: ActiveDateRange, isFinished?: boolean) => void
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>,
    prevIcon: NonNullable<Props['prevIcon']>,
    nextIcon: NonNullable<Props['nextIcon']>,
    monthsBefore: NonNullable<Props['monthsBefore']>,
    monthsAfter: NonNullable<Props['monthsAfter']>,
    missedRow: NonNullable<Props['missedRow']>
}


export { ActiveDateRange, Props, DefaultProps }