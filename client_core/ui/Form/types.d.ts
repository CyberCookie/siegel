import type { PropsComponentBase, CoreUIComponent, NewComponentAttributes } from '../_internals/types'
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

type FormStore = [ ValuesState, React.Dispatch<React.SetStateAction<ValuesState>> ]


type InputData = {
    Component: _Input
    props: InputProps
}
type CheckboxData = {
    Component: _Checkbox
    props: CheckboxProps
}
type Validator = {
    validate(value: ValueStateValue): boolean,
    msg: string
}

type InputsData = {
    disabledIf: string | string[]
    validators?: Validator[]
} & (InputData | CheckboxData)

type InputsArray = (InputsData | (InputsData | InputsData[])[])[]


type Props = PropsComponentBase<{
    onSubmit(values: ValuesState, e: React.FormEvent<HTMLFormElement>): void
    inputs: InputsArray
    rootTagAttributes?: NewComponentAttributes<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>
}>

type DefaultProps = {}

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, Component,
    ValueStateValue, FormStore, Validator, CommonChangeProps
}