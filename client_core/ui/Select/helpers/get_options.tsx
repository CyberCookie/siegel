import React from 'react'

import applyClassName from '../../_internals/apply_classname'

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
            if (!listSelectedOption) continue
        }

        const optionProps: ReactTagAttributes<HTMLDivElement> = {
            children: title,
            className: applyClassName(theme.option, [
                [ theme.option__active, isSelected || arrowSelectIndex == i ],
                [ theme.option__disabled, disabled ],
                [ className, true ]
            ]),
            onMouseDown: disabled
                ?   undefined
                :   e => { onSelect(value, e, payload) },
            key: value
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