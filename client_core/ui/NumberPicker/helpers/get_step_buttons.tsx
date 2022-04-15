import React from 'react'

import type { ComponentAttributes } from '../../_internals/types'
import type { MergedProps, OnNumberPickerChange } from '../types'


type BtnClickEv = React.MouseEvent<HTMLButtonElement>

type BtnProps = ComponentAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>

function getStepButtons(
    props: MergedProps,
    numberValue: number,
    onNumberPickerChange: OnNumberPickerChange
) {

    const { theme, disabled, step, plusIcon, minusIcon, min, max } = props

    const plusProps: BtnProps = {
        className: theme.button_plus,
        children: plusIcon
    }
    if (disabled || (numberValue >= max)) {
        plusProps.disabled = true
    } else {
        plusProps.onMouseDown = (e: BtnClickEv) => {
            onNumberPickerChange(e, true, step)
        }
    }

    const minusProps: BtnProps = {
        className: theme.button_minus,
        children: minusIcon
    }

    if (disabled || (numberValue <= min)) {
        minusProps.disabled = true
    } else {
        minusProps.onMouseDown = (e: BtnClickEv) => {
            onNumberPickerChange(e, false, -step!)
        }
    }

    minusProps.tabIndex = plusProps.tabIndex = -1


    return (
        <div className={ theme.controls }>
            <button { ...minusProps } />
            <button { ...plusProps } />
        </div>
    )
}


export default getStepButtons