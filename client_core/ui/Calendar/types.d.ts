import type { PropsComponentThemed, CoreUIComponent, CoreUIReactTagAttributes } from '../_internals/types'


type PostProcessCalendarDayParams = {
    /** Date element wrapper className */
    className: string | undefined

    /** Date element */
    children: React.ReactNode
}

type StringValues = {
    /** Months names */
    months: [
        string, string, string, string, string, string,
        string, string, string, string, string, string
    ]

    /** Week days names */
    weekDays: [ string, string, string, string, string, string, string ]
}


type Theme = {
    /** Root tag state during a range dates selection */
    _in_progress?: string

    /** Calendar month wrapper */
    month_wrapper?: string

    /** Calendar month title wrapper */
    month_title_wrapper?: string

    /** Month title */
    month_title?: string

    /** Month switch icons */
    icon_month?: string

    /** Year switch icons */
    icon_year?: string

    /** Previous month/year icons */
    icon_prev?: string

    /** next month/year icons */
    icon_next?: string

    /** Calendar month days wrapper */
    month_days_wrapper?: string

    /** Week days names row */
    week?: string

    /** Week day name */
    week_day?: string

    /** Month week days row */
    row?: string

    /** Month day */
    day?: string

    /** Side months days of a currently selected month */
    day_month_sibling?: string

    /** Selected day state */
    day__selected?: string

    /** First day of a currently selected month if props.hideSiblingMonthsDays == true */
    day__first?: string

    /** Last day of a currently selected month if props.hideSiblingMonthsDays == true */
    day__last?: string

    /** Today day */
    day__today?: string

    /**
     * Applied to a side months days of a currently selected month,
     * if props.hideSiblingMonthsDays == true
     */
    day__hidden?: string

    /** First day of a range dates selection */
    day__range_from?: string

    /** Last day of a range dates selection */
    day__range_to?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    /** Calendar initial date */
    initDate: {
        /** Selected date timestamp or range dates selection start */
        rangeDateStart: number

        /** Range dates selection finish */
        rangeDateEnd?: number
    }

    /**
     * Triggered on date selection
     *
     * @param range - Same object as props.initDate
     * @param isFinished - Whether range dates selection is in progress or has already ended
     * @param payload - Props.payload
     */
    onChange?(
        range: Required<Props['initDate']>,
        isFinished: boolean,
        payload: _Payload
    ): void

    /**
     * Triggered on month switch
     *
     * @param date - New current month first day timestamp
     * @param value - Increment value
     * @param event - Click event
     */
    onMonthSwitch?(
        date: Date,
        value: number,
        event: React.MouseEvent<HTMLDivElement>
    ): void

    /**
     * Triggered when current year is changed
     *
     * @param date - New current year first day timestamp
     * @param value - New current year
     * @param event - Click event
     */
    onYearSwitch?(
        date: Date,
        value: number,
        event: React.MouseEvent<HTMLDivElement>
    ): void

    /**
     * Allows you to return a custom date element
     * and className to be applied to its wrapper
     *
     * @param params - Day element data consists of date number
     * and its wrapper className
     */
    postProcessCalendarDay?(params: PostProcessCalendarDayParams): PostProcessCalendarDayParams

    /**
     * Allows you to customize default month title markdown
     *
     * @param params - Default title params
     */
    constructCalendarTitle?(
        params: {
            /** Go to previous month icon */
            prevMonthIcon: Props['prevMonthIcon']

            /** Go to next month icon */
            nextMonthIcon: Props['nextMonthIcon']

            /** Go to previous year icon */
            prevYearIcon: Props['prevYearIcon']

            /** Go to next year icon */
            nextYearIcon: Props['nextYearIcon']

            /** Title year */
            year: number

            /** Title month name */
            monthName: string
        }
    ): React.ReactNode

    /** Hides side months days */
    hideSiblingMonthsDays?: boolean

    /** Always renders fixed number of month days rows */
    fixedHeight?: boolean

    /** Doesn't place month / year switch controls */
    noControls?: boolean

    /** Go to previous month icon */
    prevMonthIcon?: React.ReactNode

    /** Go to next month icon */
    nextMonthIcon?: React.ReactNode

    /** Go to previous year icon */
    prevYearIcon?: React.ReactNode

    /** Go to next year icon */
    nextYearIcon?: React.ReactNode

    /** Number of months to render before active month */
    monthsBefore?: number

    /** Number of months to render after active month */
    monthsAfter?: number

    /** Week day index to start a week from */
    weekStartsFrom?: 1 | 2 | 3 | 4 | 5 | 6

    /**
     * During range date selection, triggers props.onChange only when
     * selection has finished
     */
    triggerOnlyWhenFinished?: boolean

    /** Any data to be retrieven when props.onChange is triggered */
    payload?: _Payload

    /** Enabled range date selection */
    rangePick?: boolean

    /** Root tag [<div>] attributes */
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>

    /** Names to be used for months and week days names */
    strings?: StringValues | (() => StringValues)
}>

type DefaultProps = NonNullableProps<{
    theme: Props['theme']
    strings: StringValues
    monthsBefore: Props['monthsBefore']
    monthsAfter: Props['monthsAfter']
    fixedHeight: Props['fixedHeight']
    triggerOnlyWhenFinished: Props['triggerOnlyWhenFinished']
}>

type MergedProps = Props & DefaultProps

type Store = ReactStore<{
    innerRangeStart: Props['initDate']['rangeDateStart']
    innerRangeEnd: NonNullable<Props['initDate']['rangeDateEnd']>
    inProgress: boolean
    anchor: number
    beginOfMonth: Date
}>


type Component = CoreUIComponent<Props, DefaultProps>


export type { Component, Store, Props, DefaultProps, MergedProps }