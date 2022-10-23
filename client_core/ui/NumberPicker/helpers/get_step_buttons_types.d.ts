import type { ReactTagAttributes } from '../../_internals/types'

import { MergedProps, OnNumberPickerChange, OnFocusEventHandler } from '../types'


type BtnClickEv = React.MouseEvent<HTMLButtonElement>

type BtnProps = ReactTagAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>

type GetStepperButtons = (
    params: {
        props: MergedProps
        min: MergedProps['min']
        max: MergedProps['max']
        numberValue: number
        onStepChange: OnNumberPickerChange
        onPickerBlur: OnFocusEventHandler | undefined
        onPickerFocus: OnFocusEventHandler | undefined
    }
) => {
    stepperElement: JSX.Element
    isDisabledUp: boolean
    isDisabledDown: boolean
}


export type { BtnClickEv, BtnProps, GetStepperButtons }