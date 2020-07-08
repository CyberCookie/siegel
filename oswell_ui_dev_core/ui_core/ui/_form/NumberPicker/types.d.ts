import { PropsComponentThemed, CoreIUComponent } from '../../ui_utils'
import { InputTagProps } from '../autofocus'


type ThemeKeys = '_disabled_all' | 'controls' | 'button_minus' | 'button_plus' | 'label_wrapper'
    | 'label' | 'field' | keyof InputTagProps['theme']

type Props = {
    onChange: (
        value: string,
        e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<HTMLInputElement>,
        payload?: any
    ) => void
    step?: number
    min?: number
    max?: number
    label?: React.ReactNode
    minusIcon?: React.ReactNode
    plusIcon?: React.ReactNode
    payload?: any
    disabledInput?: boolean
    regexp?: RegExp
    precision?: number
} & PropsComponentThemed<ThemeKeys> & Omit<InputTagProps, 'theme'>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    minusIcon: NonNullable<Props['minusIcon']>
    plusIcon: NonNullable<Props['plusIcon']>
    min: NonNullable<Props['min']>
    max: NonNullable<Props['max']>
}

type _NumberPicker = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _NumberPicker }