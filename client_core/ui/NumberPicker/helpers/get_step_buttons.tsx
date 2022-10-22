import React from 'react'

import type { MergedProps, OnNumberPickerChange } from '../types'
import type { BtnClickEv, BtnProps } from './get_step_buttons_types'


function getStepButtons(
    props: MergedProps,
    numberValue: number,
    onNumberPickerChange: OnNumberPickerChange
) {

    const { theme, disabled, step, plusIcon, minusIcon, min, max } = props


    let isDisabledUp = false
    const plusProps: BtnProps = {
        className: theme.button_plus,
        children: plusIcon
    }
    if (disabled || (numberValue >= max)) {
        plusProps.disabled = isDisabledUp = true
    } else {
        plusProps.onMouseDown = (e: BtnClickEv) => {
            onNumberPickerChange(e, true, step!)
        }
    }


    let isDisabledDown = false
    const minusProps: BtnProps = {
        className: theme.button_minus,
        children: minusIcon
    }
    if (disabled || (numberValue <= min)) {
        minusProps.disabled = isDisabledDown = true
    } else {
        minusProps.onMouseDown = (e: BtnClickEv) => {
            onNumberPickerChange(e, false, -step!)
        }
    }

    minusProps.tabIndex = plusProps.tabIndex = -1


    const stepperElement = (
        <div className={ theme.controls }>
            <button { ...plusProps } />
            <button { ...minusProps } />
        </div>
    )


    return { stepperElement, isDisabledUp, isDisabledDown }
}


export default getStepButtons