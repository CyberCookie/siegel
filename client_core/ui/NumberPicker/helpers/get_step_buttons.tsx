import React from 'react'

import type { BtnProps, GetStepperButtons } from './get_step_buttons_types'


const getStepButtons: GetStepperButtons = params => {
    const {
        props: {
            theme, disabled, step, valueIncrementIcon, valueDecrementIcon,
            disabledInput, onStepButtonClick
        },
        min, max, onStepChange, numberValue, onPickerBlur, onPickerFocus
    } = params


    let isDisabledUp = false
    const plusProps: BtnProps = {
        className: theme.value_increment_icon,
        children: valueIncrementIcon
    }
    if (disabled || (numberValue >= max)) {
        plusProps.className += ` ${theme.button__disabled}`
        isDisabledUp = true
    } else {
        plusProps.onClick = e => {
            onStepButtonClick?.(e, true)
            !e.defaultPrevented && onStepChange(e, true, step!)
        }
    }


    let isDisabledDown = false
    const minusProps: BtnProps = {
        className: theme.value_decrement_icon,
        children: valueDecrementIcon
    }
    if (disabled || (numberValue <= min)) {
        minusProps.className += ` ${theme.button__disabled}`
        isDisabledDown = true
    } else {
        minusProps.onClick = e => {
            onStepButtonClick?.(e, false)
            !e.defaultPrevented && onStepChange(e, false, -step!)
        }
    }

    minusProps.tabIndex = plusProps.tabIndex = -1

    if (!disabledInput) {
        minusProps.onBlur = plusProps.onBlur = onPickerBlur
        minusProps.onFocus = plusProps.onFocus = onPickerFocus
    }


    const stepperElement = (
        <div className={ theme.controls }>
            <button { ...plusProps } />
            <button { ...minusProps } />
        </div>
    )


    return { stepperElement, isDisabledUp, isDisabledDown }
}


export default getStepButtons