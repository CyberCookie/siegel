import { PropsComponentThemed, CoreIUComponent } from '../../ui_utils'


type ActiveDateRange = {
    rangeDateStart: number
    rangeDateEnd?: number
}


type ThemeKeys = 'icon_next' | 'icon_prev' | 'month_title' | 'month_days' | 'month_selector'
    | 'month__sibling' | 'week' | 'week_day' | 'day' | 'day_subtext' | 'day__selected' | 'day__first'
    | 'day__last' | 'day__today' | 'day__hidden' | 'date' | 'date__anchor' | 'start' | 'end' | 'start_end'
    | 'in_progress' | 'row' | 'row_placeholder'

type Props = {
    activeDate: ActiveDateRange
    onChange: (range: ActiveDateRange, isFinished: boolean, payload: any) => void
    hideSiblingMonthsDays?: boolean
    prevIcon?: React.ReactNode
    nextIcon?: React.ReactNode
    monthsBefore?: number
    monthsAfter?: number
    missedRow?: 'placeholder' | 'filled'
    weekStartsFrom?: 1 | 2 | 3 | 4 | 5 | 6
    noControlls?: boolean
    triggerOnlyWhenFinished?: boolean
    locale?: string
    payload?: any
    rangePick?: boolean
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    prevIcon: NonNullable<Props['prevIcon']>
    nextIcon: NonNullable<Props['nextIcon']>
    monthsBefore: NonNullable<Props['monthsBefore']>
    monthsAfter: NonNullable<Props['monthsAfter']>
}



type ChildProps = {
    calendarProps: Props & DefaultProps
    parentState: {
        innerRangeStart: ActiveDateRange['rangeDateStart']
        innerRangeEnd: NonNullable<ActiveDateRange['rangeDateEnd']>
    }
    beginOfMonth: Date
    days: string[]
}

type AllDaysData = {
    timestamp: number
    date: number
    isSiblingMonth?: boolean
    hidden?: boolean
    isFirst?: boolean
    isLast?: boolean
    isToday?: boolean
}

type PrevNextDaysParams = {
    beginOfMonth: ChildProps['beginOfMonth']
    days: ChildProps['days']
    hideSiblingMonthsDays: ChildProps['calendarProps']['hideSiblingMonthsDays']
    weekStartsFrom: ChildProps['calendarProps']['weekStartsFrom']
    missedRow: ChildProps['calendarProps']['missedRow']
}

type GetDayClass = (params: {
    theme: ChildProps['calendarProps']['theme']
    dayObj: AllDaysData
    hideSiblingMonthsDays: ChildProps['calendarProps']['hideSiblingMonthsDays']
    innerRangeStart: ChildProps['parentState']['innerRangeStart']
    innerRangeEnd: ChildProps['parentState']['innerRangeEnd']
}) => string

type _Calendar = CoreIUComponent<Props, DefaultProps>


export { _Calendar, ActiveDateRange, Props, DefaultProps, ChildProps, AllDaysData, PrevNextDaysParams, GetDayClass }