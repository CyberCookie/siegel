import { MergedProps, OnNumberPickerChange, ComponentFocusEventHandler } from '../types'


type BtnProps = ReactTagAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>

type GetStepperButtons = (
    params: {
        props: MergedProps
        min: MergedProps['min']
        max: MergedProps['max']
        numberValue: number
        onStepChange: OnNumberPickerChange
        onPickerBlur: ComponentFocusEventHandler | undefined
        onPickerFocus: ComponentFocusEventHandler | undefined
    }
) => {
    stepperElement: React.JSX.Element
    isDisabledUp: boolean
    isDisabledDown: boolean
}


export type { BtnProps, GetStepperButtons }