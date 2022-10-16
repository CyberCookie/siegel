import React from 'react'

import applyClassName from '../../../../_internals/apply_classname'
import getFirstMonthDate from '../../get_first_month_date'
import getDayClassName from './get_day_classname'
import getCalendarMonthDays from './get_days_data_array'

import type { ReactTagAttributes } from '../../../../_internals/types'
import type { ChildProps } from './types'

import styles from '../../../styles.sass'


const DAYS_IN_WEEK = 7

const getDays = (props: ChildProps) => {
    const {
        beginOfMonth,
        parentStore: [ parentState, setParentState ],
        calendarProps: {
            weekStartsFrom, hideSiblingMonthsDays, fixedHeight, theme, postProcessCalendarDay,
            onChange, triggerOnlyWhenFinished, payload, rangePick, monthsBefore
        }
    } = props
    const { innerRangeStart, innerRangeEnd, inProgress, anchor } = parentState


    const allDays = getCalendarMonthDays({
        beginOfMonth, hideSiblingMonthsDays, weekStartsFrom, fixedHeight
    })

    const className = applyClassName(theme.month_days_wrapper, [[ theme._in_progress, inProgress ]])

    let rowClassName = styles.row
    theme.row && (rowClassName += ` ${rowClassName}`)

    const hiddenDateClassName = applyClassName(styles.day__hidden, [
        [ theme.day, true ],
        [ theme.day__hidden, true ]
    ])

    const rows = []
    for (let i = 0, day = 0; i <= allDays.length / DAYS_IN_WEEK && day < allDays.length; i++) {

        const dayRow = []
        for (let dayInWeek = 0; dayInWeek < DAYS_IN_WEEK; dayInWeek++, day++) {
            const { timestamp, date, hidden, isSiblingMonth } = allDays[day]

            let children, className: string | undefined
            if (hidden) {
                className = hiddenDateClassName
            } else {
                children = date
                className = getDayClassName({
                    theme, hideSiblingMonthsDays, innerRangeStart, innerRangeEnd,
                    dayObj: allDays[day]
                })
            }
            if (postProcessCalendarDay) {
                ({ children, className } = postProcessCalendarDay({ children, className }))
            }


            dayRow.push(
                <div key={ timestamp } className={ className } children={ children }
                    data-is_sibling={ isSiblingMonth }
                    data-timestamp={ timestamp } />
            )
        }

        rows.push(<div key={ i } className={ rowClassName } children={ dayRow } />)
    }


    const rootProps: ReactTagAttributes<HTMLDivElement> = {
        className,
        children: rows,
        onMouseDown(e) {
            e.stopPropagation()

            const rangeDateStart = +(e.target as HTMLDivElement).dataset.timestamp!
            if (rangeDateStart) {
                if (inProgress) {
                    parentState.inProgress = false
                    setParentState({ ...parentState })

                    onChange?.({
                        rangeDateStart: innerRangeStart,
                        rangeDateEnd: innerRangeEnd
                    }, true, payload)

                } else {
                    const date = new Date(rangeDateStart)
                    const curMonthSelected = date.getMonth()
                    const rangeDateEnd = date.setDate(date.getDate() + 1) - 1

                    setParentState({
                        innerRangeEnd: rangeDateEnd,
                        innerRangeStart: rangeDateStart,
                        inProgress: rangePick as boolean,
                        anchor: rangeDateStart,
                        beginOfMonth: rangePick || curMonthSelected == parentState.beginOfMonth.getMonth()
                            ?   parentState.beginOfMonth
                            :   getFirstMonthDate(rangeDateStart, monthsBefore)
                    })


                    const isSinglePick = !rangePick
                    if (onChange && (isSinglePick || (rangePick && !triggerOnlyWhenFinished))) {
                        onChange({ rangeDateStart, rangeDateEnd }, isSinglePick, payload)
                    }
                }
            }
        }
    }
    inProgress && (rootProps.onMouseOver = e => {
        e.stopPropagation()
        const timestamp = +(e.target as HTMLDivElement).dataset.timestamp!

        if (timestamp) {
            let date: Date
            if (timestamp >= anchor) {
                date = new Date(timestamp)
                parentState.innerRangeStart = anchor
            } else {
                date = new Date(anchor)
                parentState.innerRangeStart = timestamp
            }
            parentState.innerRangeEnd = date.setDate(date.getDate() + 1) - 1
            setParentState({ ...parentState })

            onChange && !triggerOnlyWhenFinished && onChange({
                rangeDateStart: parentState.innerRangeStart,
                rangeDateEnd: parentState.innerRangeEnd
            }, false, payload)
        }
    })


    return <div { ...rootProps } />
}


export default getDays