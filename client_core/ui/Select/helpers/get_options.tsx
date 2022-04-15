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

    const { options, selected, theme, filterSelected } = props

    const optionElements = []
    let selectedOption
    for (let i = 0; i < options.length; i++) {
        const option = options[i]
        const { disabled, title, value, payload, className } = option

        const isSelected = value === selected

        isSelected && (selectedOption = option)

        let optionClassName = theme.option
        if ((isSelected && !filterSelected) || arrowSelectIndex == i) {
            optionClassName += ` ${theme.option__active}`
        }

        className && (optionClassName += ` ${className}`)

        const optionProps: ComponentAttributes<HTMLDivElement> = {
            children: title,
            className: optionClassName
        }

        disabled
            ?   optionProps.className += ` ${theme.option__disabled}`
            :   optionProps.onMouseDown = (e: React.MouseEvent) => {
                    onSelect(value, e, payload)
                }


        optionElements.push( <div { ...optionProps } key={ value as string } /> )
    }


    return {
        selectedOption,
        optionsElement: (
            <div className={ theme.options } onMouseDown={ stopPropagationHandler }
                children={ optionElements } />
        )
    }
}


export default getOptions