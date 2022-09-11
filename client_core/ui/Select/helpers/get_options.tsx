import React from 'react'

import type { ComponentAttributes } from '../../_internals/types'
import type { MergedProps, Store } from '../types'


function stopPropagationHandler(e: React.MouseEvent) {
    e.stopPropagation()
}

function getOptions(
    props: MergedProps,
    onSelect: MergedProps['onChange'],
    arrowSelectIndex: Store[0]['arrowSelectIndex']
) {

    const { options, selected, theme, listSelectedOption, listDisabledOptions } = props

    const optionElements = []
    let selectedOption, selectedOptionIndex
    for (let i = 0; i < options.length; i++) {
        const option = options[i]
        const { disabled, title, value, payload, className } = option

        if (!listDisabledOptions && disabled) continue

        const isSelected = value === selected

        if (isSelected) {
            selectedOption = option
            selectedOptionIndex = i
            if (listSelectedOption) continue
        }

        let optionClassName = theme.option
        if (isSelected || arrowSelectIndex == i) {
            optionClassName += ` ${theme.option__active}`
        }
        className && (optionClassName += ` ${className}`)

        const optionProps: ComponentAttributes<HTMLDivElement> = {
            children: title,
            className: optionClassName,
            key: value
        }

        disabled
            ?   optionProps.className += ` ${theme.option__disabled}`
            :   optionProps.onMouseDown = (e: React.MouseEvent) => {
                    onSelect(value, e, payload)
                }


        optionElements.push( <div { ...optionProps } /> )
    }


    return {
        selectedOption, selectedOptionIndex,
        optionsElement: (
            <div className={ theme.options } onMouseDown={ stopPropagationHandler }
                children={ optionElements } />
        )
    }
}


export default getOptions