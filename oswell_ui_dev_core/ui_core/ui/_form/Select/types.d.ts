import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type Props = {
    dropdownIcon?: React.ReactNode
    closeOnSelect?: boolean
    label?: React.ReactNode
    onChange: (id: ID, e: React.MouseEvent, payload: any) => void
    options: {
        disabled?: boolean
        payload?: any
        id: ID
        title: React.ReactNode
    }[],
    selected?: ID
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