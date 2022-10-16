import React from 'react'

import type { MergedProps } from '../../types'

import styles from '../../styles.sass'


function getWeekDaysRow(localeWeek: string[], theme: MergedProps['theme']) {
    const getWeekDay = (day: string) => <div className={ theme.week_day } key={ day } children={ day } />
    let className = styles.week
    theme.week && (className += ` ${theme.week}`)

    return <div className={ className } children={ localeWeek.map(getWeekDay) } />
}


export default getWeekDaysRow