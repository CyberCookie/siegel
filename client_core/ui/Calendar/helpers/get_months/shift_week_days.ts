import type { MergedProps } from '../../types'


function getWeekDaysShifted(
    weekStartsFrom: NonNullable<MergedProps['weekStartsFrom']>,
    weekDays: string[]
) {

    const result = []
    for (let i = weekStartsFrom, l = weekDays.length; i < l; i++) result.push(weekDays[i])
    for (let i = 0; i < weekStartsFrom; i++) result.push(weekDays[i])

    return result
}


export default getWeekDaysShifted