import type { MergedProps } from '../../types'


function getWeekDaysShifted(weekStartsFrom: MergedProps['weekStartsFrom'], weekDays: string[]) {
    const localeWeek = [ ...weekDays ]
    return localeWeek.concat(localeWeek.splice(0, weekStartsFrom))
}


export default getWeekDaysShifted