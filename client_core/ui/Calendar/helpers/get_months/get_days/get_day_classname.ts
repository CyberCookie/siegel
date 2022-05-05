import type { MergedProps, Store } from '../../../types'
import type { AllDaysData } from './types'


type State = Store[0]

type GetDayClass = (params: {
    dayObj: AllDaysData
    theme: MergedProps['theme']
    hideSiblingMonthsDays: MergedProps['hideSiblingMonthsDays']
    innerRangeStart: State['innerRangeStart']
    innerRangeEnd: State['innerRangeEnd']
}) => string


const getDayClassName: GetDayClass = getDayClassParams => {
    const {
        theme, hideSiblingMonthsDays, innerRangeStart, innerRangeEnd,
        dayObj: { timestamp, isSiblingMonth, isLast, isFirst, isToday }
    } = getDayClassParams


    let className = theme.day

    isToday && (className += ` ${theme.day__today}`)
    isSiblingMonth && (className += ` ${theme.month__sibling}`)

    if (hideSiblingMonthsDays) {
        isFirst && (className += ` ${theme.day__first}`)
        isLast && (className += ` ${theme.day__last}`)
    }

    if (innerRangeStart != innerRangeEnd) {
        const rangeEndZero = (new Date(innerRangeEnd)).setHours(0,0,0,0)
        innerRangeStart <= timestamp && timestamp <= rangeEndZero && (className += ` ${theme.day__selected}`)

        timestamp == innerRangeStart && (className += ` ${theme.day__range_from}`)
        timestamp == rangeEndZero && (className += ` ${theme.day__range_to}`)
    }


    return className
}


export default getDayClassName