import { PropsComponentThemed } from '../ui_utils'


type Props = {
    attributes?: React.Attributes
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
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
    closeOnSelect: NonNullable<Props['closeOnSelect']>
    dropdownIcon: NonNullable<Props['dropdownIcon']>
}


export { Props, DefaultProps }