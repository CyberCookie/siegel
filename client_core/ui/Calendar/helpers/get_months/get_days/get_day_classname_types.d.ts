import type { MergedProps, Store } from '../../../types'


type State = Store[0]

type GetDayClass = (params: {
    dayObj: AllDaysData
    theme: MergedProps['theme']
    hideSiblingMonthsDays: MergedProps['hideSiblingMonthsDays']
    innerRangeStart: State['innerRangeStart']
    innerRangeEnd: State['innerRangeEnd']
}) => string | undefined


export type { GetDayClass }