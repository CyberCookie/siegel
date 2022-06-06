import React, { useState } from 'react'

import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'
import componentID from './id'
import { getMonths, getFirstMonthDate } from './helpers'
import type { Component, Props } from './types'

import styles from './styles.sass'


const Calendar: Component = component(
    componentID,
    {
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
    },
    props => {

        const {
            monthsBefore, refApi, rootTagAttributes, className,
            initDate: { rangeDateStart, rangeDateEnd }
        } = props

        const store = useState({
            innerRangeStart: rangeDateStart,
            innerRangeEnd: rangeDateEnd || rangeDateStart,
            inProgress: false,
            anchor: 0,
            beginOfMonth: getFirstMonthDate(rangeDateStart, monthsBefore)
        })


        let rootAttributes = {
            className: `${className} ${styles.root}`,
            children: getMonths(props, store)
        }
        refApi && (applyRefApi(rootAttributes, props))
        rootTagAttributes && (rootAttributes = mergeTagAttributes(rootAttributes, rootTagAttributes))


        return <div { ...rootAttributes } />
    }
)


export default Calendar
export { componentID }
export type { Component, Props }