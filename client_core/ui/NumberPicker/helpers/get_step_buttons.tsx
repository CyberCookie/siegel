import React from 'react'

import type { BtnProps, GetStepperButtons } from './get_step_buttons_types'


const getStepButtons: GetStepperButtons = params => {
    const {
        props: {
            theme, disabled, step, plusIcon, minusIcon,
            disabledInput
        },
        min, max, onStepChange, numberValue, onPickerBlur, onPickerFocus
    } = params


    let isDisabledUp = false
    const plusProps: BtnProps = {
        className: theme.button_plus,
        children: plusIcon
    }
    if (disabled || (numberValue >= max)) {
        plusProps.className += ` ${theme.button__disabled}`
        isDisabledUp = true
    } else {
        plusProps.onClick = e => {
            onStepChange(e, true, step!)
        }
    }


    let isDisabledDown = false
    const minusProps: BtnProps = {
        className: theme.button_minus,
        children: minusIcon
    }
    if (disabled || (numberValue <= min)) {
        minusProps.className += ` ${theme.button__disabled}`
        isDisabledDown = true
    } else {
        minusProps.onClick = e => {
            onStepChange(e, false, -step!)
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