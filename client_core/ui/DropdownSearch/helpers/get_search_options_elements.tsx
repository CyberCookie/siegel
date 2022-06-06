import React from 'react'

import type { ComponentAttributes } from '../../_internals/types'
import type { MergedProps, State, onSelectInner } from '../types'


function getSearchOptions(params: MergedProps, state: State, onSelect: onSelectInner) {
    const { showAll, searchOptions, theme, selected } = params
    const { searchString, arrowSelectIndex } = state
    const searchLower = searchString?.toLowerCase()

    const options: JSX.Element[] = []
    let selectedOption
    searchOptions.forEach((option, i) => {
        const { title, inputValue, value, className, disabled, alwaysVisible } = option

        const isSelected = value == selected
        isSelected && (selectedOption = option)

        const canPush = alwaysVisible || showAll || (!searchLower || inputValue.toLowerCase().includes(searchLower))
        if (canPush) {
            const optionProps: ComponentAttributes<HTMLDivElement> = {
                className: theme.option,
                children: title || inputValue
            }
            className && (optionProps.className += ` ${className}`)
            if (isSelected || arrowSelectIndex == i) {
                optionProps.className += ` ${theme.option__selected}`
            }
            disabled || (optionProps.onMouseDown = e => {
                onSelect(option, e)
            })


            options.push( <div { ...optionProps } key={ value as string } /> )
        }
    })


    return {
        selectedOption,
        optionsElement: <div children={ options } className={ theme.options } />
    }
}


export default getSearchOptions