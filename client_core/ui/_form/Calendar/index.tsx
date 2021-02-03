//TODO add year switcher
//TODO add day postprocess hook
//TODO don't finish range selection when switch month / year

import React, { useRef, useState } from 'react'

import { dateLocales } from '../../../utils/date/consts'
import { extractProps } from '../../ui_utils'
import Days from './days_of_month'
import type { Props, DefaultProps, MergedProps, _Calendar, Store } from './types'

import styles from './styles.sass'


const componentID = '-ui-calendar'


function getDefaultStrings() {
    const { months, weekDaysShort } = dateLocales.get.en()
    return { months, weekDaysShort }
}

const getBeginOfMonth = (rangeDateStart: Props['initDate']['rangeDateStart'], monthsBefore: Props['monthsBefore']) => {
    const curDate = new Date(rangeDateStart)
    curDate.setHours(0,0,0,0)
    curDate.setDate(1)

    monthsBefore && (curDate.setMonth(curDate.getMonth() - monthsBefore))

    return curDate
}


function getWeekDaysShifted(weekStartsFrom: MergedProps['weekStartsFrom'], weekDays: string[]) {
    const localeWeek = [ ...weekDays ]
    return localeWeek.concat(localeWeek.splice(0, weekStartsFrom))
}

function switchMonth(value: number, store: Store, e: React.MouseEvent) {
    e.stopPropagation()
    
    const [ state, setState ] = store;
    state.beginOfMonth.setMonth(state.beginOfMonth.getMonth() + value)
    setState({ ...state })
}

function getWeekDayRow(localeWeek: string[], theme: DefaultProps['theme']) {
    const getWeekDay = (day: string) => <div className={theme.week_day} key={day} children={day} /> 

    return <div className={`${theme.week} ${styles.week}`} children={localeWeek.map(getWeekDay)} />
}

function getCalendarVisuals(
    mergedProps: MergedProps,
    store: Store,
    pickRangeStart: (e: React.MouseEvent) => void
) {
    const { prevIcon, nextIcon, noControls, theme, monthsBefore, monthsAfter, weekStartsFrom, strings } = mergedProps;
    const state = store[0]


    const weekDayNames = weekStartsFrom
        ?   getWeekDaysShifted(weekStartsFrom, strings.weekDaysShort)
        :   strings.weekDaysShort;
    const weekdaysRow = getWeekDayRow(weekDayNames, theme)
    const iconPrev = noControls || (
        <div className={theme.icon} onMouseDown={e => switchMonth(-1, store, e)}
            children={prevIcon} />
    )
    const iconNext = noControls || (
        <div className={theme.icon} onMouseDown={e => switchMonth(1, store, e)}
            children={nextIcon} />
    )

    const start = new Date(state.beginOfMonth)
    
    const months = []
    for (let i = 0, l = monthsBefore + monthsAfter + 1; i < l; i++) {
        const month = start.getMonth()
        
        months.push(
            <div key={i} className={theme.month_wrapper}>
                <div className={`${theme.month_title_wrapper} ${styles.month_title_wrapper}`}>
                    { iconPrev }

                    <div className={theme.month_title}>
                        { strings.months[month] }&nbsp;
                        { start.getFullYear() }
                    </div>

                    { iconNext }
                </div>

                { weekdaysRow }

                <Days calendarProps={mergedProps}
                    pickRangeStart={pickRangeStart}
                    parentState={state}
                    beginOfMonth={new Date(start)} />
            </div>
        )

        start.setMonth(month + 1)
    }

    return months
}

const Calendar: _Calendar = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Calendar.defaults, props)
        :   (props as _Calendar['defaults'] & typeof props)

    const { initDate, monthsBefore, payload, onChange, triggerOnlyWhenFinished, rangePick } = mergedProps;
    const className = `${mergedProps.className} ${styles.calendar}`
    
    const { rangeDateStart, rangeDateEnd } = initDate;

    const store = useState({
        innerRangeStart: rangeDateStart,
        innerRangeEnd: rangeDateEnd || rangeDateStart,
        inProgress: false,
        anchor: 0,
        beginOfMonth: getBeginOfMonth(rangeDateStart, monthsBefore)
    })
    const [ state, setState ] = store;

    const ref = useRef<HTMLDivElement>(null)


    function pickRangeStart(e: React.MouseEvent) {
        e.stopPropagation()
        
        const rangeDateStart = +(e.target as HTMLDivElement).dataset.timestamp!;
        if (rangeDateStart) {
            if (rangePick) {
                ref.current!.addEventListener('mouseup', pickRangeFinish)
                ref.current!.addEventListener('mouseover', pickRangeProgress)
            }

            const date = new Date(rangeDateStart)
            const rangeDateEnd = date.setDate(date.getDate() + 1) - 1;
            
            state.innerRangeEnd = rangeDateEnd;
            state.innerRangeStart = rangeDateStart;
            state.inProgress = rangePick as boolean;
            state.anchor = rangeDateStart;

            setState({ ...state })

            const isSinglePick = !rangePick;
            if (onChange && (isSinglePick || (rangePick && !triggerOnlyWhenFinished))) {
                onChange({ rangeDateStart, rangeDateEnd }, isSinglePick, payload)
            }
        }
    }

    function pickRangeProgress(e: MouseEvent) {
        e.stopPropagation()
        const timestamp = +(e.target as HTMLDivElement).dataset.timestamp!;

        if (timestamp) {
            const anchor = state.anchor;
            let date: Date;
            if (timestamp >= anchor) {
                date = new Date(timestamp)
                state.innerRangeStart = anchor
            } else if (timestamp < anchor) {
                date = new Date(anchor)
                state.innerRangeStart = timestamp
            }
            state.innerRangeEnd = date!.setDate(date!.getDate() + 1) - 1;

            setState({ ...state })
            onChange && !triggerOnlyWhenFinished && onChange({
                rangeDateStart: state.innerRangeStart,
                rangeDateEnd: state.innerRangeEnd
            }, false, payload)
        }
    }

    function pickRangeFinish(e: MouseEvent) {
        e.stopPropagation()
        ref.current!.removeEventListener('mouseup', pickRangeFinish)
        ref.current!.removeEventListener('mouseover', pickRangeProgress)
                
        state.inProgress = false;
        
        onChange && onChange({
            rangeDateStart: state.innerRangeStart,
            rangeDateEnd: state.innerRangeEnd
        }, true, payload)
    }


    return (
        <div className={className} ref={ref}>
            { getCalendarVisuals(mergedProps, store, pickRangeStart) }
        </div>
    )
}
Calendar.defaults = {
    theme: {
        root: componentID,
        icon: componentID + '_icon',
        month_wrapper: componentID + '_month_wrapper',
        month_title: componentID + '_month_title',
        month_days_wrapper: componentID + '_month_days_wrapper',
        month_title_wrapper: componentID + '_month_title_wrapper',
        month__sibling: componentID + '_month__sibling',
        week: componentID + '_week',
        week_day: componentID + '_week_day',
        row: componentID + '_row',
        row_placeholder: componentID + '_row_placeholder',
        day: componentID + '_day',
        day__selected: componentID + '_day__selected',
        day__first: componentID + '_day__first',
        day__last: componentID + '_day__last',
        day__today: componentID + '_day__today',
        day__placeholder: componentID + '_day__placeholder',
        from: componentID + '_from',
        to: componentID + '_to',
        _in_progress: componentID + '__in_progress'
    },
    strings: getDefaultStrings(),

    triggerOnlyWhenFinished: true,
    prevIcon: '<',
    nextIcon: '>',
    monthsBefore: 0,
    monthsAfter: 0
}
Calendar.ID = componentID;


export { componentID }
export default Calendar