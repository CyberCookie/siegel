import React from 'react'

import type { MergedProps } from '../types'
import type { GetRangeElement, GetRangePickerElement } from './get_range_area_elements_types'

import styles from '../styles.sass'


const getRange: GetRangeElement = (key, className, width, isVertival) => (
    <div key={ key } className={ className }
        style={ isVertival
            ?   { height: `${width}%` }
            :   { width: `${width}%` }
        } />
)
const getRangePicker: GetRangePickerElement = (key, { theme, rangePickIcon, isVertical }, left) => (
    <div  key={ key } children={ rangePickIcon } data-slider={ key[1] || '' }
        style={ isVertical
            ?   { top: `${left}%` }
            :   { left: `${left}%` }
        }
        className={ `${theme.range_slider} ${styles.range_slider}` } />
)

function getRangeAreaElements(
    mergedProps: MergedProps,
    valueValidated: MergedProps['value'],
    isSingleValue: boolean
) {

    const { theme, isVertical } = mergedProps

    const result = []
    if (isSingleValue) {
        const selectedRangePercent = valueValidated[0] * 100
        const unselectedRangePercent = 100 - selectedRangePercent

        result.push(
            getRange('s', theme.range__selected, selectedRangePercent, isVertical),
            getRangePicker('r', mergedProps, selectedRangePercent),
            getRange('u', theme.range__unselected, unselectedRangePercent, isVertical)
        )
    } else {
        let lastMaxSize = 0
        for (let i = 0, l = valueValidated.length; i < l; i += 2) {
            const fromPercent = valueValidated[i] * 100
            const toPercent = valueValidated[i + 1] * 100

            result.push(
                getRange(`u${i}`, theme.range__unselected, fromPercent - lastMaxSize, isVertical),
                getRangePicker(`r${i}`, mergedProps, fromPercent),
                getRange(`s${i}`, theme.range__selected, toPercent - fromPercent, isVertical),
                getRangePicker(`r${i + 1}`, mergedProps, toPercent)
            )

            lastMaxSize = toPercent
        }

        result.push(
            getRange('u_final', theme.range__unselected, 100 - lastMaxSize, isVertical)
        )
    }


    return <>{ result }</>
}


export default getRangeAreaElements