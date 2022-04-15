import type { PropsComponentBase, CoreIUComponent, NewComponentAttributes } from '../_internals/types'
import type { Component as _Input, Props as InputProps } from '../Input/types'
import type { Component as _Checkbox, Props as CheckboxProps } from '../Checkbox/types'


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
type FormInput = {
    disabledIf: string | string[]
    validators?: Validator[]
} & (InputData | CheckboxData)


type Props = PropsComponentBase<{
    onSubmit(values: ValuesState, e: React.FormEvent<HTMLFormElement>): void
    inputs: Indexable<FormInput>
    rootTagAttributes?: NewComponentAttributes<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>
}>

type DefaultProps = {}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component,
    ValueStateValue, FormStore, Validator, CommonChangeProps
}