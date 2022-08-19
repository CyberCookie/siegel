import type { PropsComponentThemed, CoreUIComponent, NewComponentAttributes } from '../_internals/types'


type PostProcessCalendarDayParams = {
    className: string
    children: React.ReactNode
}

type StringValues = {
    months: [
        string, string, string, string, string, string,
        string, string, string, string, string, string
    ]
    weekDaysShort: [ string, string, string, string, string, string, string ]
}


type Theme = {
    _in_progress?: string
    month_wrapper?: string
    month_title_wrapper?: string
    month_title?: string
    icon_month?: string
    icon_year?: string
    icon_prev?: string
    icon_next?: string
    month_days_wrapper?: string
    month__sibling?: string
    week?: string
    week_day?: string
    row?: string
    day?: string
    day__selected?: string
    day__first?: string
    day__last?: string
    day__today?: string
    day__hidden?: string
    day__range_from?: string
    day__range_to?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    initDate: {
        rangeDateStart: number
        rangeDateEnd?: number
    }
    onChange?(range: Props['initDate'], isFinished: boolean, payload: _Payload): void
    onMonthSwitch?(date: Date, value: number, e: React.MouseEvent): void
    onYearSwitch?(date: Date, value: number, e: React.MouseEvent): void
    postProcessCalendarDay?(children: PostProcessCalendarDayParams): PostProcessCalendarDayParams
    constructCalendarTitle?(
        params: {
            prevMonthIcon: Props['prevMonthIcon']
            nextMonthIcon: Props['nextMonthIcon']
            prevYearIcon: Props['prevYearIcon']
            nextYearIcon: Props['nextYearIcon']
            year: number
            monthName: string
        }
    ): React.ReactNode
    hideSiblingMonthsDays?: boolean
    fixedHeight?: boolean
    noControls?: boolean
    prevMonthIcon?: React.ReactNode
    nextMonthIcon?: React.ReactNode
    prevYearIcon?: React.ReactNode
    nextYearIcon?: React.ReactNode
    monthsBefore?: number
    monthsAfter?: number
    weekStartsFrom?: 1 | 2 | 3 | 4 | 5 | 6
    triggerOnlyWhenFinished?: boolean
    payload?: _Payload
    rangePick?: boolean
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
    strings?: StringValues | (() => StringValues)
}>

type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
    strings: StringValues
    prevMonthIcon: Props['prevMonthIcon']
    nextMonthIcon: Props['nextMonthIcon']
    prevYearIcon: Props['prevYearIcon']
    nextYearIcon: Props['nextYearIcon']
    monthsBefore: Props['monthsBefore']
    monthsAfter: Props['monthsAfter']
    fixedHeight: Props['fixedHeight']
    triggerOnlyWhenFinished: Props['triggerOnlyWhenFinished']
}>

type MergedProps = Props & DefaultProps

type State = {
    innerRangeStart: Props['initDate']['rangeDateStart']
    innerRangeEnd: NonNullable<Props['initDate']['rangeDateEnd']>
    inProgress: boolean
    anchor: number
    beginOfMonth: Date
}
type Store = [ State, React.Dispatch<React.SetStateAction<State>> ]


type Component = CoreUIComponent<Props, DefaultProps>


export type { Component, Store, Props, MergedProps }