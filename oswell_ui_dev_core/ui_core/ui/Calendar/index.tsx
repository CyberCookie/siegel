import React, { useRef, useState, MutableRefObject } from 'react'

import { dateLocalizationByLocale } from '../../utils/date_const'
import { setDefaultProps, extractProps } from '../ui_utils'
import Days from './days_of_month'
import s from './styles.sass'
import { ActiveDateRange, Props, DefaultProps } from './types'


const componentID = '-ui-calendar';

const defaults: DefaultProps = {
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

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}


function getBeginOfMonth(rangeDateStart: ActiveDateRange['rangeDateStart'], monthsBefore: Props['monthsBefore']) {
    let curDate = new Date(rangeDateStart)
    curDate.setHours(0,0,0,0)
    curDate.setDate(1)

    monthsBefore && (curDate.setMonth(curDate.getMonth() - monthsBefore))

    return curDate
}

function getWeekDayNames(days: string[], theme: DefaultProps['theme']) {
    const getWeekDay = (day: string) => <div className={theme.week_day} key={day} children={day} /> 

    return <div className={`${theme.week} ${s.week}`} children={days.map(getWeekDay)} />
}

const Calendar = (props: Props) => {
    let mergedProps = extractProps(defaults, props)
    let { theme, activeDate, locale, weekStartsFrom, monthsBefore, monthsAfter, prevIcon, payload,
        nextIcon, noControlls, onChange, triggerOnlyWhenFinished, className } = mergedProps;
    
    className += ` ${theme.calendar} ${s.calendar}`;
    
    let { rangeDateStart, rangeDateEnd } = activeDate;

    let [ state, setState ] = useState({
        innerRangeStart: rangeDateStart,
        innerRangeEnd: rangeDateEnd || rangeDateStart,
        inProgress: false,
        anchor: 0,
        beginOfMonth: getBeginOfMonth(rangeDateStart, monthsBefore)
    })

    let ref = useRef<HTMLDivElement>()
    
    let { inProgress, beginOfMonth } = state;
    let _locale = dateLocalizationByLocale[locale || 'en']
    let days = weekStartsFrom ? shiftWeekDays() : _locale.daysShort;


    function shiftWeekDays() {
        let days = [..._locale.daysShort]
        return days.concat(days.splice(0, weekStartsFrom))
    }

    function switchMonth(value: number, e: React.MouseEvent) {
        e.stopPropagation()
        
        state.beginOfMonth.setMonth(beginOfMonth.getMonth() + value)
        setState({ ...state })
    }

    function pickRangeStart(e: React.MouseEvent) {
        e.stopPropagation()

        let rangeDateStart = +(e.target as HTMLDivElement).dataset.timestamp;

        if (rangeDateStart) {
            (ref as MutableRefObject<HTMLDivElement>).current.addEventListener('mouseup', pickRangeFinish);
            (ref as MutableRefObject<HTMLDivElement>).current.addEventListener('mouseover', pickRangeProgress)

            let date = new Date(rangeDateStart)
            let rangeDateEnd = date.setDate(date.getDate() + 1) - 1;
            
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
        let timestamp = +(e.target as HTMLDivElement).dataset.timestamp;

        if (timestamp) {
            let anchor = state.anchor;
            if (timestamp > anchor) {
                let date = new Date(timestamp)

                state.innerRangeStart = anchor;
                state.innerRangeEnd = date.setDate(date.getDate() + 1) - 1
            } else if (timestamp < anchor) {
                let date = new Date(anchor)

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
        e.stopPropagation();
        (ref as MutableRefObject<HTMLDivElement>).current.removeEventListener('mouseup', pickRangeFinish);
        (ref as MutableRefObject<HTMLDivElement>).current.removeEventListener('mouseover', pickRangeProgress)
                
        state.inProgress = false;
        
        onChange({
            rangeDateStart: state.innerRangeStart,
            rangeDateEnd: state.innerRangeEnd
        }, true, payload)
    }

    function getAllMonths() {
        let start = new Date(beginOfMonth);
        
        let className = theme.month_days;
        inProgress && (className += ` ${theme.in_progress}`)
        

        let months = [];
        for (let i = 0, l = monthsBefore + monthsAfter + 1; i < l; i++) {
            let titleMonth = _locale.months[start.getMonth()];
            let titleYear = start.getFullYear();

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
                            beginOfMonth={new Date(start)}
                            locale={_locale} />
                    </div>
                </div>
            )

            start.setMonth( start.getMonth() + 1 )
        }

        return months
    }


    return <div className={className} ref={ref} children={getAllMonths()} />
}


export { setDefaults }
export default Calendar