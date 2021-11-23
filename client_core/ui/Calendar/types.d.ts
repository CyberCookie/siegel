import type { DateResolver } from '../../utils/date/consts'
import type { PropsComponentThemed, CoreIUComponent, ComponentAttributes } from '../_internals/types'


type ThemeKeys = 'month_wrapper' | 'month_title_wrapper' | 'icon' | 'month_title'
    | 'month_days_wrapper' | 'month__sibling' | 'week' | 'week_day' | 'row' | 'day' | 'day__selected' | 'day__first'
    | 'day__last' | 'day__today' | 'day__placeholder' | 'from' | 'to' | '_in_progress'


type Props<_Payload = any> = {
    initDate: {
        rangeDateStart: number
        rangeDateEnd?: number
    }
    onChange?(range: Props['initDate'], isFinished: boolean, payload: _Payload): void
    onMonthSwitch?(date: Date, value: number, e: React.MouseEvent): void
    hideSiblingMonthsDays?: boolean
    prevIcon?: React.ReactNode
    nextIcon?: React.ReactNode
    monthsBefore?: number
    monthsAfter?: number
    fixedHeight?: boolean
    weekStartsFrom?: 1 | 2 | 3 | 4 | 5 | 6
    noControls?: boolean
    triggerOnlyWhenFinished?: boolean
    locale?: string
    payload?: _Payload
    rangePick?: boolean
    attributes?: ComponentAttributes<HTMLDivElement>
    strings?: {
        months: ReturnType<DateResolver>['months']
        weekDaysShort: ReturnType<DateResolver>['weekDaysShort']
    }
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    strings: NonNullable<Props['strings']>
    prevIcon: NonNullable<Props['prevIcon']>
    nextIcon: NonNullable<Props['nextIcon']>
    monthsBefore: NonNullable<Props['monthsBefore']>
    monthsAfter: NonNullable<Props['monthsAfter']>
    fixedHeight: boolean
    triggerOnlyWhenFinished: NonNullable<Props['triggerOnlyWhenFinished']>
}

type MergedProps = Props & DefaultProps

type State = {
    innerRangeStart: Props['initDate']['rangeDateStart']
    innerRangeEnd: NonNullable<Props['initDate']['rangeDateEnd']>
    inProgress: boolean
    anchor: number
    beginOfMonth: Date
}
type Store = [ State, React.Dispatch<React.SetStateAction<State>> ]

type ChildProps = {
    calendarProps: MergedProps
    parentState: State
    beginOfMonth: Date
    pickRangeStart(e: React.MouseEvent): void
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
    hideSiblingMonthsDays: MergedProps['hideSiblingMonthsDays']
    weekStartsFrom: MergedProps['weekStartsFrom']
    fixedHeight: MergedProps['fixedHeight']
}

type GetDayClass = (params: {
    dayObj: AllDaysData
    theme: MergedProps['theme']
    hideSiblingMonthsDays: MergedProps['hideSiblingMonthsDays']
    innerRangeStart: State['innerRangeStart']
    innerRangeEnd: State['innerRangeEnd']
}) => string

type Component = CoreIUComponent<Props, DefaultProps>


export type { Component, Store, Props, DefaultProps, MergedProps, ChildProps,
    AllDaysData, PrevNextDaysParams, GetDayClass }