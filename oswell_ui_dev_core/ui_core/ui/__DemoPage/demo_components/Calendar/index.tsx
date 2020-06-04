import React from 'react'

import Calendar from '../../../_form/Calendar'
import { Props } from '../../../_form/Calendar/types'
import { chevron } from '../../icons'

import s from './styles.sass'


const theme: Props['theme'] = {
    root: s.calendar,
    icon: s.icon,
    month_wrapper: s.month_wrapper,
    month_title_wrapper: s.month_title_wrapper,
    month_title: s.month_title,
    month__sibling: s.month__sibling,
    day: s.day,
    day__first: s.day__first,
    day__last: s.day__last,
    day__today: s.day__today,
    day__selected: s.day__selected,
    week: s.week,
    week_day: s.week_day,
    _in_progress: s._in_progress,
    from: s.from,
    to: s.to,
    row: s.row
}

const timestamp = Date.now()

const Demo = () => {
    const props: Props = {
        theme,
        prevIcon: chevron,
        nextIcon: chevron,
        initDate: {
            rangeDateStart: timestamp,
            rangeDateEnd: timestamp
        }
    }

    
    
    return <>
        <h1>{Calendar.ID}</h1>
    
        <h2>simple</h2>
        <Calendar {...props} />

        <h2>range pick, months before/after 1</h2>
        <Calendar {...props} monthsBefore={1} monthsAfter={1} rangePick />
    </>
}
Demo.id = Calendar.ID;


export default Demo