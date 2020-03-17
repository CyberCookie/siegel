import React, { useRef, useState } from 'react'

import { dateLocalizationByLocale } from '../../utils/date_const'
import { extractProps } from '../ui_utils'
import Days from './days_of_month'
import s from './styles.sass'
import { ActiveDateRange, Props, DefaultProps, _Calendar } from './types'


const componentID = '-ui-calendar'

const getBeginOfMonth = (rangeDateStart: ActiveDateRange['rangeDateStart'], monthsBefore: Props['monthsBefore']) => {
    const curDate = new Date(rangeDateStart)
    curDate.setHours(0,0,0,0)
    curDate.setDate(1)

    monthsBefore && (curDate.setMonth(curDate.getMonth() - monthsBefore))

    return curDate
}

function getWeekDayNames(days: string[], theme: DefaultProps['theme']) {
    const getWeekDay = (day: string) => <div className={theme.week_day} key={day} children={day} /> 

    return <div className={`${theme.week} ${s.week}`} children={days.map(getWeekDay)} />
}

const Calendar: _Calendar = (props, withDefaults) => {
    const mergedProps = withDefaults
        ?   (props as _Calendar['defaults'] & typeof props)
        :   extractProps(Calendar.defaults, props)

    const { theme, activeDate, locale, weekStartsFrom, monthsBefore, monthsAfter, prevIcon, payload,
        nextIcon, noControlls, onChange, triggerOnlyWhenFinished } = mergedProps;
    let className = mergedProps.className;
    
    className += ` ${theme.calendar} ${s.calendar}`
    
    const { rangeDateStart, rangeDateEnd } = activeDate;

    const [ state, setState ] = useState({
        innerRangeStart: rangeDateStart,
        innerRangeEnd: rangeDateEnd || rangeDateStart,
        inProgress: false,
        anchor: 0,
        beginOfMonth: getBeginOfMonth(rangeDateStart, monthsBefore)
    })

    const ref = useRef<HTMLDivElement>(null)
    
    const { inProgress, beginOfMonth } = state;
    const _locale = dateLocalizationByLocale[locale || 'en']
    const days = weekStartsFrom ? shiftWeekDays() : _locale.daysShort;


    function shiftWeekDays() {
        const days = [..._locale.daysShort]
        return days.concat(days.splice(0, weekStartsFrom))
    }

    function switchMonth(value: number, e: React.MouseEvent) {
        e.stopPropagation()
        
        state.beginOfMonth.setMonth(beginOfMonth.getMonth() + value)
        setState({ ...state })
    }

    function pickRangeStart(e: React.MouseEvent) {
        e.stopPropagation()
        
        const rangeDateStart = +(e.target as HTMLDivElement).dataset.timestamp!;


        if (rangeDateStart) {
            ref.current!.addEventListener('mouseup', pickRangeFinish)
            ref.current!.addEventListener('mouseover', pickRangeProgress)

            const date = new Date(rangeDateStart)
            const rangeDateEnd = date.setDate(date.getDate() + 1) - 1;
            
            state.innerRangeEnd = rangeDateEnd;
            state.innerRangeStart = rangeDateStart;
            state.inProgress = true;
            state.anchor = rangeDateStart;

            triggerOnlyWhenFinished
                ?   setState({ ...state })
                :   onChange({ rangeDateStart, rangeDateEnd }, false, payload)
        }
    }

    function pickRangeProgress(e: MouseEvent) {
        e.stopPropagation()
        const timestamp = +(e.target as HTMLDivElement).dataset.timestamp!;

        if (timestamp) {
            const anchor = state.anchor;
            if (timestamp > anchor) {
                const date = new Date(timestamp)

                state.innerRangeStart = anchor;
                state.innerRangeEnd = date.setDate(date.getDate() + 1) - 1
            } else if (timestamp < anchor) {
                const date = new Date(anchor)

                state.innerRangeStart = timestamp;
                state.innerRangeEnd = date.setDate(date.getDate() + 1) - 1
            }

            triggerOnlyWhenFinished
                ?   setState({ ...state })
                :   onChange({
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
        
        onChange({
            rangeDateStart: state.innerRangeStart,
            rangeDateEnd: state.innerRangeEnd
        }, true, payload)
    }

    function getAllMonths() {
        const start = new Date(beginOfMonth)
        
        let className = theme.month_days;
        inProgress && (className += ` ${theme.in_progress}`)
        

        const months = []
        for (let i = 0, l = monthsBefore + monthsAfter + 1; i < l; i++) {
            const titleMonth = _locale.months[start.getMonth()]
            const titleYear = start.getFullYear()

            months.push(
                <div key={i}>
                    <div className={`${theme.month_selector} ${s.month_selector}`}>
                        { noControlls || (
                            <div className={`${s.icon_prev} ${theme.icon_prev}`} onMouseDown={e => switchMonth(-1, e)}
                                children={prevIcon} />
                        )}

                        <div className={theme.month_title}>{titleMonth} {titleYear}</div>

                        { noControlls || (
                            <div className={`${s.icon_next} ${theme.icon_next}`} onMouseDown={e => switchMonth(1, e)}
                                children={nextIcon} />
                        )}
                    </div>

                    { getWeekDayNames(days, theme) }

                    <div className={className} onMouseDown={pickRangeStart}>
                        <Days calendarProps={mergedProps} days={days}
                            parentState={{
                                innerRangeEnd: state.innerRangeEnd,
                                innerRangeStart: state.innerRangeStart,
                            }}
                            beginOfMonth={new Date(start)} />
                    </div>
                </div>
            )

            start.setMonth( start.getMonth() + 1 )
        }

        return months
    }


    return <div className={className} ref={ref} children={getAllMonths()} />
}
Calendar.defaults = {
    theme: {
        calendar: componentID,
        title__side: componentID + '_title__side',
        title__left: componentID + '_title__left',
        title__right: componentID + '_title__right',
        icon_next: componentID + '_icon_next',
        icon_prev: componentID + '_icon_prev',
        month_title: componentID + '_month_title',
        month_days: componentID + '_month_days',
        month_selector: componentID + '_month_selector',
        month__sibling: componentID + '_month__sibling',
        week: componentID + '_week',
        week_day: componentID + '_week_day',
        day: componentID + '_day',
        day_subtext: componentID + '_day_subtext',
        day__selected: componentID + '_day__selected',
        day__first: componentID + '_day__first',
        day__last: componentID + '_day__last',
        day__today: componentID + '_day__today',
        day__hidden: componentID + '_day__hidden',
        date: componentID + '_date',
        date__anchor: componentID + '_date__anchor',
        start: componentID + '_start',
        end: componentID + '_end',
        start_end: componentID + '_start_end',
        in_progress: componentID + '_in_progress',
        row: componentID + '_row',
        row_placeholder: componentID + '_row_placeholder'
    },

    prevIcon: '<',
    nextIcon: '>',
    monthsBefore: 0,
    monthsAfter: 0
}
Calendar.ID = componentID;


export { componentID }
export default Calendar