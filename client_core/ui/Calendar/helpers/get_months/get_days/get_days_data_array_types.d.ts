import type { MergedProps } from '../../../types'
import { ChildProps } from './types'


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

type FillWithDateRangeParams = {
    result: AllDaysData[]
    dateFrom: number
    dateTo: number
    date: Date
    hidden?: boolean
}


export type { AllDaysData, PrevNextDaysParams, FillWithDateRangeParams }