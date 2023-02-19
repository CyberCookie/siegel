import type { ReactTagAttributes } from '../../_internals/types'

import { MergedProps, OnNumberPickerChange, ComponentFocusEvent } from '../types'


type BtnProps = ReactTagAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>

type GetStepperButtons = (
    params: {
        props: MergedProps
        min: MergedProps['min']
        max: MergedProps['max']
        numberValue: number
        onStepChange: OnNumberPickerChange
        onPickerBlur: ComponentFocusEvent | undefined
        onPickerFocus: ComponentFocusEvent | undefined
    }
) => {
    stepperElement: JSX.Element
    isDisabledUp: boolean
    isDisabledDown: boolean
}


export type { BtnProps, GetStepperButtons }