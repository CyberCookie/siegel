import React from 'react'

import getWeekDaysShifted from './shift_week_days'
import getControlIcon from './get_control_icon'
import getDays from './get_days'
import getWeekDaysRow from './get_week_days_row'

import type { MergedProps, Store } from '../../types'

import styles from '../../styles.sass'


function getMonths(mergedProps: MergedProps, store: Store) {
    const {
        theme, monthsBefore, monthsAfter, weekStartsFrom, strings,
        noControls, prevMonthIcon, nextMonthIcon, prevYearIcon, nextYearIcon, constructCalendarTitle
    } = mergedProps
    const state = store[0]

    const stringValues = typeof strings == 'function'
        ?   strings()
        :   strings

    const weekDayNames = weekStartsFrom
        ?   getWeekDaysShifted(weekStartsFrom, stringValues.weekDays)
        :   stringValues.weekDays
    const weekdaysRow = getWeekDaysRow(weekDayNames, theme)

    let prevMonthIconEl, nextMonthIconEl, prevYearIconEl, nextYearIconEl
    if (!noControls) {
        prevMonthIconEl = getControlIcon(true, true, mergedProps, store)
        nextMonthIconEl = getControlIcon(true, false, mergedProps, store)
        prevYearIconEl = getControlIcon(false, true, mergedProps, store)
        nextYearIconEl = getControlIcon(false, false, mergedProps, store)
    }

    const start = new Date(state.beginOfMonth)

    let monthTitleWrapper = styles.month_title_wrapper
    theme.month_title_wrapper && (monthTitleWrapper += ` ${theme.month_title_wrapper}`)

    const months = []
    for (let i = 0, l = monthsBefore + monthsAfter + 1; i < l; i++) {
        const year = start.getFullYear()
        const month = start.getMonth()
        const monthName = stringValues.months[month]

        const monthWraperTitle = constructCalendarTitle?.({
            monthName, year, prevMonthIcon, nextMonthIcon, nextYearIcon, prevYearIcon
        })
        ||
        <>
            { prevMonthIconEl }
            { prevYearIconEl }

            <div className={ theme.month_title }>
                { monthName }&nbsp;
                { year }
            </div>

            { nextYearIconEl }
            { nextMonthIconEl }
        </>


        months.push(
            <div key={ i } className={ theme.month_wrapper }>
                <div className={ monthTitleWrapper } children={ monthWraperTitle } />

                { weekdaysRow }

                { getDays({
                    calendarProps: mergedProps,
                    parentStore: store,
                    beginOfMonth: new Date(start)
                }) }
            </div>
        )

        start.setMonth(month + 1)
    }


    return months
}


export default getMonths