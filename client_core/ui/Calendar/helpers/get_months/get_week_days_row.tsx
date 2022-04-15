import React from 'react'

import type { MergedProps } from '../../types'

import styles from '../../styles.sass'


function getWeekDaysRow(localeWeek: string[], theme: MergedProps['theme']) {
    const getWeekDay = (day: string) => <div className={ theme.week_day } key={ day } children={ day } />

    return <div className={ `${theme.week} ${styles.week}` } children={ localeWeek.map(getWeekDay) } />
}


export default getWeekDaysRow