import type {
    AllDaysData, PrevNextDaysParams, FillWithDateRangeParams
} from './get_days_data_array_types'


const DAYS_IN_WEEK = 7

function fillWithDateRange(params: FillWithDateRangeParams) {
    const { result, dateFrom, dateTo, date, hidden } = params

    let timestamp = date.getTime()
    for (let i = dateFrom; i <= dateTo; i++) {
        result.push({
            hidden, timestamp,
            date: i,
            isSiblingMonth: true
        })

        timestamp = date.setDate(date.getDate() + 1)
    }
}

function getPreviousMonthDays(params: PrevNextDaysParams) {
    const { beginOfMonth, hideSiblingMonthsDays, weekStartsFrom } = params

    const date = new Date(beginOfMonth)
    date.setDate(0)
    const dateTo = date.getDate()
    const lastDay = date.getDay()

    let dateFrom = dateTo - lastDay
    if (weekStartsFrom) {
        if (weekStartsFrom >= lastDay) {
            dateFrom -= (DAYS_IN_WEEK - weekStartsFrom)
        } else {
            dateFrom += weekStartsFrom
        }
    }

    const result: AllDaysData[] = []
    const isFullRow = (dateTo - (dateFrom - 1)) == DAYS_IN_WEEK
    if (!(hideSiblingMonthsDays && isFullRow)) {
        date.setDate(dateFrom)

        fillWithDateRange({
            result, date, dateFrom, dateTo,
            hidden: hideSiblingMonthsDays
        })
    }


    return result
}

function fillCurrentMonth(result: AllDaysData[], beginOfMonth: Date) {
    const date = new Date(beginOfMonth)
    const lastDayinCurrentMonth = (new Date(beginOfMonth.getFullYear(), beginOfMonth.getMonth() + 1, 0)).getDate()
    const todayTimestamp = (new Date()).setHours(0, 0, 0, 0)

    let timestamp = date.getTime()
    for (let dateOfMonth = 1; dateOfMonth <= lastDayinCurrentMonth; dateOfMonth++) {
        const dayData: AllDaysData = {
            timestamp,
            date: dateOfMonth
        }
        dateOfMonth == 1 && (dayData.isFirst = true)
        dateOfMonth == lastDayinCurrentMonth && (dayData.isLast = true)
        timestamp == todayTimestamp && (dayData.isToday = true)

        result.push(dayData)

        timestamp = date.setDate(date.getDate() + 1)
    }
}

function fillNextMonth(result: AllDaysData[], params: PrevNextDaysParams) {
    const { beginOfMonth, hideSiblingMonthsDays, weekStartsFrom } = params

    const date = new Date(beginOfMonth)
    const firstDay = date.getDay()

    let dateTo = 0
    if (!(hideSiblingMonthsDays && firstDay == weekStartsFrom)) {
        date.setMonth(date.getMonth() + 1)
        dateTo = DAYS_IN_WEEK - (result.length % DAYS_IN_WEEK)

        fillWithDateRange({
            result, date, dateTo,
            dateFrom: 1,
            hidden: hideSiblingMonthsDays
        })
    }


    return dateTo
}

function getCalendarMonthDays(prevNextDaysParams: PrevNextDaysParams) {
    const { beginOfMonth, fixedHeight, hideSiblingMonthsDays } = prevNextDaysParams

    let allDays = getPreviousMonthDays(prevNextDaysParams)
    const countBefore = allDays.length

    fillCurrentMonth(allDays, beginOfMonth)

    const countAfter = fillNextMonth(allDays, prevNextDaysParams)


    if (fixedHeight && allDays.length < 42) {
        if (countBefore < countAfter) {
            const { date: toDate, timestamp } = allDays[0]
            const dateFrom = toDate - DAYS_IN_WEEK
            const date = new Date(timestamp)
            date.setDate(dateFrom)

            const pasteBefore: AllDaysData[] = []
            fillWithDateRange({
                date, dateFrom,
                hidden: hideSiblingMonthsDays,
                result: pasteBefore,
                dateTo: toDate - 1
            })
            allDays = pasteBefore.concat(allDays)
        } else {
            const { date: fromDate, timestamp } = allDays.at(-1)!
            const date = new Date(timestamp)
            date.setDate(date.getDate() + 1)

            fillWithDateRange({
                date,
                hidden: hideSiblingMonthsDays,
                result: allDays,
                dateFrom: fromDate + 1,
                dateTo: fromDate + DAYS_IN_WEEK
            })
        }
    }

    return allDays
}


export default getCalendarMonthDays