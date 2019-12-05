import React from 'react'

import s from './styles'


const missedRowType = {
    PLACEHOLDER: 'placeholder',
    FILLED: 'filled'
}


function fillWithSiblingMonthDateRange(result, dateFrom, dateTo, date, hidden) {
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

function getPreviousMonthDays(params) {
    let result = []
    let { beginOfMonth, hideSiblingMonthsDays, weekStartsFrom, days } = params;

    let date = new Date(beginOfMonth);
    date.setDate(0)

    let lastDate = date.getDate();
    let lastDay = date.getDay();
    let startDate = lastDate - lastDay;

    if (weekStartsFrom) {
        if (weekStartsFrom >= lastDay) {
            startDate -= (days.length - weekStartsFrom)
        } else {
            startDate += weekStartsFrom
        }
    }

    let isFullRow = (lastDate - (startDate - 1)) === days.length;
    
    if (!(hideSiblingMonthsDays && isFullRow)) {
        date.setDate(startDate);

        fillWithSiblingMonthDateRange(result, startDate, lastDate, date, hideSiblingMonthsDays)
    }

    return result
}

function fillWithCurrentMonthDays(result, beginOfMonth) {
    let date = new Date(beginOfMonth)
    let timestamp = date.getTime();
    let lastDayinCurrentMonth = (new Date(beginOfMonth.getFullYear(), beginOfMonth.getMonth() + 1, 0)).getDate();
    let todayTimestamp = (new Date()).setHours(0, 0, 0, 0);
    
    for (let dateOfMonth = 1; dateOfMonth <= lastDayinCurrentMonth; dateOfMonth++) {
        let dayData = {
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

function fillWithNextMonthDays(result, params, locale) {
    let { beginOfMonth, hideSiblingMonthsDays, weekStartsFrom, days } = params;

    let date = new Date(beginOfMonth);
    let firstDay = date.getDay();

    let daysToAdd = 0;
    
    if (!(hideSiblingMonthsDays && firstDay == weekStartsFrom)) {
        date.setMonth(date.getMonth() + 1);
        daysToAdd = days.length - (result.length % days.length);

        fillWithSiblingMonthDateRange(result, 1, daysToAdd, date, hideSiblingMonthsDays)


        // result[0].subText = locale.monthsShort[date.getMonth()]
    }

    return daysToAdd
}

function getCalendarMonthDays(prevNextDaysParams, locale) {
    let allDays = getPreviousMonthDays(prevNextDaysParams)
    let countBefore = allDays.length;

    fillWithCurrentMonthDays(allDays, prevNextDaysParams.beginOfMonth)

    let countAfter = fillWithNextMonthDays(allDays, prevNextDaysParams, locale)


    if (prevNextDaysParams == missedRowType.FILLED && allDays.length < 42) {
        let isHiddenSiblings = prevNextDaysParams.hideSiblingMonthsDays;

        if (countBefore < countAfter) {
            let { date: toDate, timestamp } = allDays[0]
            let fromDate = toDate - 7;
            let date = new Date(timestamp)
            date.setDate(fromDate)

            let pasteBefore = []
            fillWithSiblingMonthDateRange(pasteBefore, fromDate, toDate - 1, date, isHiddenSiblings)
            allDays = pasteBefore.concat(allDays)
        } else {
            let { date: fromDate, timestamp } = allDays[allDays.length - 1];
            let date = new Date(timestamp)
            fillWithSiblingMonthDateRange(allDays, fromDate + 1, fromDate + 7, date, isHiddenSiblings)
        }
    }

    return allDays
}


function getDayClass({ theme, dayObj, hideSiblingMonthsDays, innerRangeStart, innerRangeEnd }) {
    let { timestamp, isSiblingMonth, isLast, isFirst, isToday } = dayObj

    let className = `${s.day} ${theme.day}`;

    let rangeEndZero = (new Date(innerRangeEnd)).setHours(0,0,0,0)


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


const Days = props => {
    let { calendarProps, parentState, days, theme, locale } = props;

    let { weekStartsFrom, hideSiblingMonthsDays, missedRow } = calendarProps;
    let { innerRangeStart, innerRangeEnd, beginOfMonth } = parentState
    
    let prevNextDaysParams = { beginOfMonth, hideSiblingMonthsDays, weekStartsFrom, days, missedRow }
    let allDays = getCalendarMonthDays(prevNextDaysParams, locale)


    let rows = [];
    for (let i = 0, day = 0; i <= allDays.length / days.length && day < allDays.length; i++) {
        let dayRow = [];

        for (let dayInWeek = 0; dayInWeek < days.length; dayInWeek++, day++) {
            let { timestamp, date, subText, hidden } = allDays[day];

            let HTMLDay = hidden
                ?   <div key={timestamp} className={`${theme.day} ${theme.day_hidden}`} />

                :   <div key={timestamp} data-timestamp={timestamp} //data-subtext={subText}
                        className={ getDayClass({
                            theme, hideSiblingMonthsDays, innerRangeStart, innerRangeEnd,
                            dayObj: allDays[day]
                        })}>

                        { date }
                    </div>;


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