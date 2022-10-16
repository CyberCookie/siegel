import React from 'react'

import applyClassName from '../../../_internals/apply_classname'

import type { MergedProps, Store } from '../../types'


function getControlIcon(
    isMonth: boolean,
    isPrev: boolean,
    props: MergedProps,
    store: Store
) {

    const {
        theme, onMonthSwitch, onYearSwitch,
        prevMonthIcon, nextMonthIcon, prevYearIcon, nextYearIcon
    } = props

    const icon = isMonth
        ?   isPrev ? prevMonthIcon: nextMonthIcon
        :   isPrev ? prevYearIcon : nextYearIcon

    if (icon) {
        const [ state, setState ] = store

        let value: number
        let directionIconClassName: string | undefined
        if (isPrev) {
            directionIconClassName = theme.icon_prev
            value = -1

        } else {
            directionIconClassName = theme.icon_next
            value = 1
        }


        let dateMethodGet: 'getMonth' | 'getFullYear'
        let dateMethodSet: 'setMonth' | 'setFullYear'
        let optionalHandler: MergedProps['onMonthSwitch'] | MergedProps['onYearSwitch']
        if (isMonth) {
            dateMethodGet = 'getMonth'
            dateMethodSet = 'setMonth'
            optionalHandler = onMonthSwitch
        } else {
            dateMethodGet = 'getFullYear'
            dateMethodSet = 'setFullYear'
            optionalHandler = onYearSwitch
        }


        return (
            <div children={ icon }
                className={
                    applyClassName(
                        isMonth ? theme.icon_month : theme.icon_year,
                        [[ directionIconClassName, true ]]
                    )
                }
                onMouseDown={ (e: React.MouseEvent) => {
                    e.stopPropagation()

                    state.beginOfMonth[dateMethodSet](
                        state.beginOfMonth[dateMethodGet]() + value
                    )
                    setState({ ...state })

                    optionalHandler?.(state.beginOfMonth, value, e)
                } } />
        )
    }
}


export default getControlIcon