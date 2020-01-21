import { PropsComponentThemed } from '../ui_utils'


type Props = {
    attributes?: React.Attributes,
    dropdownIcon?: React.ReactNode,
    closeOnSelect?: boolean,
    label?: React.ReactNode,
    onSelect: (id: ID, e: React.MouseEvent, data?: any) => void,
    options: {
        disabled?: boolean,
        id: ID,
        title: React.ReactNode
    }[],
    selected: ID,
    displayValue: React.ReactNode
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>,
    closeOnSelect: NonNullable<Props['closeOnSelect']>,
    dropdownIcon: NonNullable<Props['dropdownIcon']>
}


export { Props, DefaultProps }