import React from 'react'

import type { MergedProps } from '../types'
import type { GetRangeElement, GetRangePickerElement } from './get_range_area_elements_types'

import styles from '../styles.sass'


const getRange: GetRangeElement = (key, className, width) => (
    <div key={ key } className={ className } style={{ width: `${width}%` }} />
)
const getRangePicker: GetRangePickerElement = (key, { theme, rangePickIcon }, left) => (
    <div  key={ key } children={ rangePickIcon } data-slider={ key[1] || '' }
        style={{ left: `${left}%` }}
        className={ `${theme.range_slider} ${styles.range_slider}` } />
)

function getRangeAreaElements(
    mergedProps: MergedProps,
    valueValidated: MergedProps['value'],
    isSingleValue: boolean
) {

    const { theme } = mergedProps

    const result = []
    if (isSingleValue) {
        const selectedRangePercent = valueValidated[0] * 100
        const unselectedRangePercent = 100 - selectedRangePercent

        result.push(
            getRange('s', theme.range__selected, selectedRangePercent),
            getRangePicker('r', mergedProps, selectedRangePercent),
            getRange('u', theme.range__unselected, unselectedRangePercent)
        )
    } else {
        let lastMaxWidth = 0
        for (let i = 0, l = valueValidated.length; i < l; i += 2) {
            const fromPercent = valueValidated[i] * 100
            const toPercent = valueValidated[i + 1] * 100

            result.push(
                getRange(`u${i}`, theme.range__unselected, fromPercent - lastMaxWidth),
                getRangePicker(`r${i}`, mergedProps, fromPercent),
                getRange(`s${i}`, theme.range__selected, toPercent - fromPercent),
                getRangePicker(`r${i + 1}`, mergedProps, toPercent)
            )

            lastMaxWidth = toPercent
        }

        result.push( getRange('u_final', theme.range__unselected, 100 - lastMaxWidth) )
    }


    return <>{ result }</>
}


export default getRangeAreaElements