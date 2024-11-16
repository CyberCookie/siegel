import React, { useState } from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'
import componentID from './id'
import { getMonths, getFirstMonthDate } from './helpers'

import type { Component, Props, DefaultProps } from './types'

import styles from './styles.sass'


const _undef = undefined

const Calendar = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            _in_progress: _undef,
            icon_prev: _undef,
            icon_next: _undef,
            icon_month: _undef,
            icon_year: _undef,
            month_wrapper: _undef,
            month_title: _undef,
            month_days_wrapper: _undef,
            month_title_wrapper: _undef,
            day_month_sibling: _undef,
            week: _undef,
            week_day: _undef,
            row: _undef,
            day: _undef,
            day__selected: _undef,
            day__first: _undef,
            day__last: _undef,
            day__today: _undef,
            day__hidden: _undef,
            day__range_from: _undef,
            day__range_to: _undef
        },
        strings: {
            months: [
                'january', 'february', 'march', 'april', 'may', 'june',
                'july', 'august', 'september', 'october', 'november', 'december'
            ],
            weekDays: [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ]
        },
        monthsBefore: 0,
        monthsAfter: 0,
        triggerOnlyWhenFinished: true,
        fixedHeight: true
    },
    props => {

        const {
            monthsBefore, rootTagAttributes, className,
            initDate: { rangeDateStart, rangeDateEnd }
        } = props

        const store = useState({
            innerRangeStart: rangeDateStart,
            innerRangeEnd: rangeDateEnd || rangeDateStart,
            inProgress: false,
            anchor: 0,
            beginOfMonth: getFirstMonthDate(rangeDateStart, monthsBefore)
        })

        let _className = styles.root
        className && (_className += ` ${className}`)

        let rootAttributes: Props['rootTagAttributes'] = {
            className: _className,
            children: getMonths(props, store)
        }
        applyRefApi(rootAttributes, props)
        rootAttributes = resolveTagAttributes(rootAttributes, rootTagAttributes)


        return <div { ...rootAttributes } />
    }
)


export default Calendar
export { componentID }
export type { Component, Props }