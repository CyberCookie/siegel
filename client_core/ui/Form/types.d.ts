import type {
    PropsComponentThemed, CoreUIComponent, CoreUIComponentWithDefaults,
    CoreUIReactTagAttributes
} from '../_internals/types'
import type { Component as _Input, Props as InputProps } from '../Input/types'
import type { Component as _NumberPicker, Props as NumberPickerProps } from '../NumberPicker/types'
import type { Component as _DropdownSearch, Props as DropdownSearchProps } from '../DropdownSearch/types'
import type { Component as _Select, Props as SelectProps } from '../Select/types'
import type { Component as _Toggle, Props as ToggleProps } from '../Toggle/types'
import type { Component as _Checkbox, Props as CheckboxProps } from '../Checkbox/types'
import type { Component as _Calendar, Props as CalendarProps } from '../Calendar/types'
import type { Component as _Ranger, Props as RangerProps } from '../Ranger/types'
import type { Component as _Stepper, Props as StepperProps } from '../Stepper/types'


type CommonChangeProps = {
    validators: Validator[]
    name: string
    formStore: FormStore
}

type ValueStateValue = Parameters<NonNullable<InputProps['onChange']>>[0]
    | Parameters<NonNullable<CheckboxProps['onChange']>>[0]

type ValuesState = Indexable<{
    value: ValueStateValue
    errorMsg?: string
}>

type FormStore = ReactStore<ValuesState>

type Validator = {
    validate(value: ValueStateValue): boolean,
    msg: string
}


type AllProps = InputProps | CheckboxProps// | NumberPickerProps | DropdownSearchProps | SelectProps | ToggleProps
    //| CheckboxProps | CalendarProps | RangerProps | StepperProps

type InputFormData<
    _CoreComponent extends CoreUIComponent<any, any>,
    _Component = CoreUIComponentWithDefaults<_CoreComponent>,
    _Props = Parameters<_Component>[0]
> = {
    Component: _Component
    props?: Partial<_Props> & Never<Pick<
        AllProps,
        Exclude<keyof InputProps | keyof CheckboxProps, keyof _Props>
    >>
}

type InputsData = {
    name: string
    disabledIf?: string | string[]
    validators?: Validator[]
} & (InputFormData<_Input> | InputFormData<_Checkbox>)

type InputsArray = (InputsData | (InputsData | InputsData[])[])[]


type Theme = {
    inputs_row?: string
    rows_block?: string
}

type Props = PropsComponentThemed<Theme, {
    onSubmit(values: ValuesState, e: React.FormEvent<HTMLFormElement>): void
    inputs: InputsArray
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>
}>

type DefaultProps = {
    theme: Required<Props['theme']>
}

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, Component,
    ValueStateValue, FormStore, Validator, CommonChangeProps
}