import React from 'react'

import applyClassName from '../../_internals/apply_classname'

import type { MergedProps, State, onSelectInner } from '../types'


function getSearchOptions(props: MergedProps, state: State, onSelect: onSelectInner) {
    const { showAll, searchOptions, theme, selected, listDisabledOptions } = props
    const { searchString, arrowSelectIndex } = state
    const searchLower = searchString?.toLowerCase()

    const options: JSX.Element[] = []
    let selectedOption, selectedOptionIndex
    for (let i = 0; i < searchOptions.length; i++) {
        const option = searchOptions[i]
        const { title, inputValue, value, className, disabled, alwaysVisible } = option

        if (!listDisabledOptions && disabled) continue

        const isSelected = value == selected
        if (isSelected) {
            selectedOption = option
            selectedOptionIndex = i
        }

        const canPush = alwaysVisible || showAll
            ||  (!searchLower || inputValue.toLowerCase().includes(searchLower))

        if (canPush) {
            const optionProps: ReactTagAttributes<HTMLDivElement> = {
                className: applyClassName(theme.option, [
                    [ className, true ],
                    [ theme.option__selected, isSelected || arrowSelectIndex == i ],
                    [ theme.option__disabled, disabled ]
                ]),
                children: title || inputValue,
                key: value
            }
            disabled || (optionProps.onMouseDown = e => { onSelect(option, e) })

            options.push( <div { ...optionProps } /> )
        }
    }


    return {
        selectedOption, selectedOptionIndex,
        optionsElement: options.length
            ?   <div children={ options } className={ theme.options } />
            :   undefined
    }
}


export default getSearchOptions