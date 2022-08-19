import React from 'react'

import type { MergedProps, Store } from '../../types'


function getControlIcon(isMonth: boolean, isPrev: boolean, props: MergedProps, store: Store) {
    const {
        theme, onMonthSwitch, onYearSwitch,
        prevMonthIcon, nextMonthIcon, prevYearIcon, nextYearIcon
    } = props

    const icon = isMonth
        ?   isPrev ? prevMonthIcon: nextMonthIcon
        :   isPrev ? prevYearIcon : nextYearIcon

    if (icon) {
        const [ state, setState ] = store

        const value = isPrev ? -1 : 1

        let className = `${isPrev ? theme.icon_prev : theme.icon_next} `
        let optionalHandler: MergedProps['onMonthSwitch'] | MergedProps['onYearSwitch']
        let dateMethodGet: 'getMonth' | 'getFullYear'
        let dateMethodSet: 'setMonth' | 'setFullYear'

        if (isMonth) {
            className += theme.icon_month
            dateMethodGet = 'getMonth'
            dateMethodSet = 'setMonth'
            optionalHandler = onMonthSwitch

        } else {
            className += theme.icon_year
            dateMethodGet = 'getFullYear'
            dateMethodSet = 'setFullYear'
            optionalHandler = onYearSwitch
        }

        function handler(e: React.MouseEvent) {
            e.stopPropagation()

            state.beginOfMonth[dateMethodSet](
                state.beginOfMonth[dateMethodGet]() + value
            )
            setState({ ...state })

            optionalHandler?.(state.beginOfMonth, value, e)
        }


        return <div className={ className } children={ icon } onMouseDown={ handler } />

    } else return null
}


export default getControlIcon