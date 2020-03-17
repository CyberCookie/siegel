import React from 'react'

import { ChildProps, AllDaysData, PrevNextDaysParams, GetDayClass } from './types'
import s from './styles.sass'


const missedRowType = {
    PLACEHOLDER: 'placeholder',
    FILLED: 'filled'
} as const


function fillWithSiblingMonthDateRange(result: AllDaysData[], dateFrom: number, dateTo: number, date: Date, hidden?: boolean) {
    let timestamp = date.getTime()

    for (let i = dateFrom; i <= dateTo; i++) {
        result.push({
            timestamp, hidden,
            date: i,
            isSiblingMonth: true
        })

        timestamp = date.setDate(date.getDate() + 1)
    }
}

function getPreviousMonthDays(params: PrevNextDaysParams) {
    const result: AllDaysData[] = []
    const { beginOfMonth, hideSiblingMonthsDays, weekStartsFrom, days } = params;

    const date = new Date(beginOfMonth)
    date.setDate(0)

    const lastDate = date.getDate()
    const lastDay = date.getDay()
    let startDate = lastDate - lastDay;

    if (weekStartsFrom) {
        if (weekStartsFrom >= lastDay) {
            startDate -= (days.length - weekStartsFrom)
        } else {
            startDate += weekStartsFrom
        }
    }

    const isFullRow = (lastDate - (startDate - 1)) === days.length;
    
    if (!(hideSiblingMonthsDays && isFullRow)) {
        date.setDate(startDate)

        fillWithSiblingMonthDateRange(result, startDate, lastDate, date, hideSiblingMonthsDays)
    }

    return result
}

function fillWithCurrentMonthDays(result: AllDaysData[], beginOfMonth: Date) {
    const date = new Date(beginOfMonth)
    const lastDayinCurrentMonth = (new Date(beginOfMonth.getFullYear(), beginOfMonth.getMonth() + 1, 0)).getDate();
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

function fillWithNextMonthDays(result: AllDaysData[], params: PrevNextDaysParams) {
    const { beginOfMonth, hideSiblingMonthsDays, weekStartsFrom, days } = params;

    const date = new Date(beginOfMonth)
    const firstDay = date.getDay()

    let daysToAdd = 0;
    
    if (!(hideSiblingMonthsDays && firstDay == weekStartsFrom)) {
        date.setMonth(date.getMonth() + 1)
        daysToAdd = days.length - (result.length % days.length)

        fillWithSiblingMonthDateRange(result, 1, daysToAdd, date, hideSiblingMonthsDays)
    }

    return daysToAdd
}

function getCalendarMonthDays(prevNextDaysParams: PrevNextDaysParams) {
    let allDays = getPreviousMonthDays(prevNextDaysParams)
    const countBefore = allDays.length;

    fillWithCurrentMonthDays(allDays, prevNextDaysParams.beginOfMonth)

    const countAfter = fillWithNextMonthDays(allDays, prevNextDaysParams)


    if (prevNextDaysParams.missedRow == missedRowType.FILLED && allDays.length < 42) {
        const isHiddenSiblings = prevNextDaysParams.hideSiblingMonthsDays;

        if (countBefore < countAfter) {
            const { date: toDate, timestamp } = allDays[0]
            const fromDate = toDate - 7;
            const date = new Date(timestamp)
            date.setDate(fromDate)

            const pasteBefore: AllDaysData[] = []
            fillWithSiblingMonthDateRange(pasteBefore, fromDate, toDate - 1, date, isHiddenSiblings)
            allDays = pasteBefore.concat(allDays)
        } else {
            const { date: fromDate, timestamp } = allDays[allDays.length - 1]
            const date = new Date(timestamp)
            fillWithSiblingMonthDateRange(allDays, fromDate + 1, fromDate + 7, date, isHiddenSiblings)
        }
    }

    return allDays
}


const getDayClass: GetDayClass = ({ theme, dayObj, hideSiblingMonthsDays, innerRangeStart, innerRangeEnd }) => {
    const{ timestamp, isSiblingMonth, isLast, isFirst, isToday } = dayObj;

    let className = `${s.day} ${theme.day}`

    const rangeEndZero = (new Date(innerRangeEnd)).setHours(0,0,0,0)


    isToday && (className += ` ${theme.day__today}`)
    isSiblingMonth && (className += ` ${theme.month__sibling}`)
    
    innerRangeStart <= timestamp && timestamp <= rangeEndZero && (className += ` ${theme.day__selected}`)
    
    if (hideSiblingMonthsDays) {
        isFirst && (className += ` ${theme.day__first}`)
        isLast && (className += ` ${theme.day__last}`)
    }
    

    timestamp == innerRangeStart && (className += ` ${theme.from}`)
    timestamp == rangeEndZero && (className += ` ${theme.to}`)

    return className
}


const Days = (props: ChildProps) => {
    const { calendarProps, parentState, days, beginOfMonth } = props;

    const { weekStartsFrom, hideSiblingMonthsDays, missedRow, theme } = calendarProps;
    const { innerRangeStart, innerRangeEnd } = parentState
    
    const prevNextDaysParams = { beginOfMonth, hideSiblingMonthsDays, weekStartsFrom, days, missedRow }
    const allDays = getCalendarMonthDays(prevNextDaysParams)


    const rows = []
    for (let i = 0, day = 0; i <= allDays.length / days.length && day < allDays.length; i++) {
        const dayRow = []

        for (let dayInWeek = 0; dayInWeek < days.length; dayInWeek++, day++) {
            const { timestamp, date, hidden } = allDays[day]

            const HTMLDay = hidden
                ?   <div key={timestamp} className={`${theme.day} ${theme.day_hidden}`} />

                :   <div key={timestamp} data-timestamp={timestamp}
                        className={ getDayClass({
                            theme, hideSiblingMonthsDays, innerRangeStart, innerRangeEnd,
                            dayObj: allDays[day]
                        })}>

                        { date }
                    </div>


            dayRow.push(HTMLDay)
        }

        rows.push(<div key={i} className={`${theme.row} ${s.row}`} children={dayRow} />)
    }

    if (missedRow == missedRowType.PLACEHOLDER && rows.length < 6) {
        rows.push(
            <div key={rows.length} className={`${theme.row} ${theme.row_placeholder}`} />
        )
    }


    return rows
}


export default Days