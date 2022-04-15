import type { Props } from '../types'


function getFirstMonthDate(
    rangeDateStart: Props['initDate']['rangeDateStart'],
    monthsBefore: Props['monthsBefore']
) {

    const date = new Date(rangeDateStart)
    date.setHours(0,0,0,0)
    date.setDate(1)

    monthsBefore && (date.setMonth(date.getMonth() - monthsBefore))


    return date
}


export default getFirstMonthDate