import type { PropsComponentBase, CoreIUComponent, ComponentAttributes } from '../../ui_utils'
import type { _Input, Props as InputProps } from '../Input/types'
import type { _Checkbox, Props as CheckboxProps } from '../Checkbox/types'


type ValueStateValue = Parameters<NonNullable<InputProps['onChange']>>[0]
    | Parameters<NonNullable<CheckboxProps['onChange']>>[0]

type ValuesState = Indexable<{
    value: ValueStateValue
    errorMsg?: string
}>


type InputData = {
    Component: _Input
    props: InputProps
}
type CheckboxData = {
    Component: _Checkbox
    props: CheckboxProps
}
type Validator = {
    validate: (value: ValueStateValue) => boolean,
    msg: string
}
type FormInput = {
    disabledIf: string | string[]
    validators?: Validator[]
} & (InputData | CheckboxData)


type Props = {
    onSubmit: (values: ValuesState, e: React.FormEvent<HTMLFormElement>) => void
    inputs: Indexable<FormInput>
    attributes?: ComponentAttributes<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>
}

type MergedProps = Props & DefaultProps

type _Form = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, _Form, ValuesState, ValueStateValue, Validator }