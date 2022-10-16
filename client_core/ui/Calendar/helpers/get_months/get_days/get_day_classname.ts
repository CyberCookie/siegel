import applyClassName from '../../../../_internals/apply_classname'

import type { GetDayClass } from './get_day_classname_types'


const getDayClassName: GetDayClass = getDayClassParams => {
    const {
        theme, hideSiblingMonthsDays, innerRangeStart, innerRangeEnd,
        dayObj: { timestamp, isSiblingMonth, isLast, isFirst, isToday }
    } = getDayClassParams


    let className = applyClassName(theme.day, [
        [ theme.day__today, isToday ],
        [ theme.month__sibling, isSiblingMonth ],
        [ theme.day__first, hideSiblingMonthsDays && isFirst ],
        [ theme.day__last, hideSiblingMonthsDays && isLast ]
    ])


    if (innerRangeStart != innerRangeEnd) {
        const rangeEndZero = (new Date(innerRangeEnd)).setHours(0,0,0,0)

        className = applyClassName(className, [
            [ theme.day__selected, innerRangeStart <= timestamp && timestamp <= rangeEndZero ],
            [ theme.day__range_from, timestamp == innerRangeStart ],
            [ theme.day__range_to, timestamp == rangeEndZero ]
        ])
    }


    return className
}


export default getDayClassName