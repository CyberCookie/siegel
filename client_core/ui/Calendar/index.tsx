import React, { useState } from 'react'

import mergeTagAttributes from '../_internals/merge_tag_attributes'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import componentID from './id'
import { getMonths, getFirstMonthDate } from './helpers'
import type { MergedProps, Component } from './types'

import styles from './styles.sass'


const Calendar: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Calendar.defaults, props, false)
        :   (props as MergedProps)

    const {
        monthsBefore, refApi, rootTagAttributes,
        initDate: { rangeDateStart, rangeDateEnd }
    } = mergedProps


    const store = useState({
        innerRangeStart: rangeDateStart,
        innerRangeEnd: rangeDateEnd || rangeDateStart,
        inProgress: false,
        anchor: 0,
        beginOfMonth: getFirstMonthDate(rangeDateStart, monthsBefore)
    })


    let rootAttributes = {
        className: `${mergedProps.className} ${styles.root}`,
        children: getMonths(mergedProps, store)
    }
    refApi && (applyRefApi(rootAttributes, mergedProps))
    rootTagAttributes && (rootAttributes = mergeTagAttributes(rootAttributes, rootTagAttributes))


    return <div { ...rootAttributes } />
}
Calendar.defaults = {
    theme: {
        root: '',
        _in_progress: '',
        icon_prev: '',
        icon_next: '',
        icon_month: '',
        icon_year: '',
        month_wrapper: '',
        month_title: '',
        month_days_wrapper: '',
        month_title_wrapper: '',
        month__sibling: '',
        week: '',
        week_day: '',
        row: '',
        day: '',
        day__selected: '',
        day__first: '',
        day__last: '',
        day__today: '',
        day__hidden: '',
        day__range_from: '',
        day__range_to: ''
    },
    strings: {
        months: [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ],
        weekDaysShort: [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ]
    },
    triggerOnlyWhenFinished: true,
    prevMonthIcon: '<',
    nextMonthIcon: '>',
    prevYearIcon: '<<',
    nextYearIcon: '>>',
    monthsBefore: 0,
    monthsAfter: 0,
    fixedHeight: true
}
Calendar.ID = componentID


export default Calendar
export { componentID }
export * from './types'