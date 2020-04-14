import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type Props<V = any> = {
    dropdownIcon?: React.ReactNode
    closeOnSelect?: boolean
    label?: React.ReactNode
    onChange: (value: V, e: React.MouseEvent, payload: any) => void
    options: {
        disabled?: boolean
        payload?: any
        value: V
        title: React.ReactNode
    }[],
    selected?: V
    displayValue: React.ReactNode
    attributes?: ComponentAttributes
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
    closeOnSelect: NonNullable<Props['closeOnSelect']>
    dropdownIcon: NonNullable<Props['dropdownIcon']>
}

type _Select = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Select }