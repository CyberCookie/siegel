import { PropsComponentThemed } from '../ui_utils'
import { DateLocalization } from '../../utils/date_const'


type ActiveDateRange = {
    rangeDateStart: number,
    rangeDateEnd?: number
}

type Props = {
    hideSiblingMonthsDays?: boolean,
    activeDate: ActiveDateRange,
    prevIcon?: React.ReactNode,
    nextIcon?: React.ReactNode,
    monthsBefore?: number,
    monthsAfter?: number,
    missedRow?: 'placeholder' | 'filled',
    weekStartsFrom?: 1 | 2 | 3 | 4 | 5 | 6,
    noControlls?: boolean,
    triggerOnlyWhenFinished?: boolean,
    locale?: string,
    onDateRangePick: (range: ActiveDateRange, isFinished?: boolean) => void
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>,
    prevIcon: NonNullable<Props['prevIcon']>,
    nextIcon: NonNullable<Props['nextIcon']>,
    monthsBefore: NonNullable<Props['monthsBefore']>,
    monthsAfter: NonNullable<Props['monthsAfter']>
}



type ChildProps = {
    calendarProps: Props & DefaultProps,
    parentState: {
        innerRangeStart: ActiveDateRange['rangeDateStart'],
        innerRangeEnd: NonNullable<ActiveDateRange['rangeDateEnd']>,
    },
    beginOfMonth: Date,
    days: string[],
    locale: DateLocalization
}

type AllDaysData = {
    timestamp: number,
    date: number,
    isSiblingMonth?: boolean,
    hidden?: boolean,
    isFirst?: boolean,
    isLast?: boolean,
    isToday?: boolean
}

type PrevNextDaysParams = {
    beginOfMonth: ChildProps['beginOfMonth'],
    days: ChildProps['days'],
    hideSiblingMonthsDays: ChildProps['calendarProps']['hideSiblingMonthsDays'],
    weekStartsFrom: ChildProps['calendarProps']['weekStartsFrom'],
    missedRow: ChildProps['calendarProps']['missedRow']
}

type GetDayClass = (params: {
    theme: ChildProps['calendarProps']['theme'],
    dayObj: AllDaysData,
    hideSiblingMonthsDays: ChildProps['calendarProps']['hideSiblingMonthsDays'],
    innerRangeStart: ChildProps['parentState']['innerRangeStart'],
    innerRangeEnd: ChildProps['parentState']['innerRangeEnd']
}) => string


export { ActiveDateRange, Props, DefaultProps, ChildProps, AllDaysData, PrevNextDaysParams, GetDayClass }