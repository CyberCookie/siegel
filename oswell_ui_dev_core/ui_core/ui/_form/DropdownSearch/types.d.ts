import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type Props = {
    searchPlaceholder?: string
    minInputLength?: number
    closeIcon?: React.ReactChild
    searchIcon?: React.ReactChild
    autofocus?: boolean
    optionBuilder: (searchOption: any) => React.ReactChild
    onChange: (searchValue: string, e: React.ChangeEvent, payload: any) => void
    searchOptions: any[]
    payload?: any
    inputAttributes?: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
    attributes?: ComponentAttributes
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>,
    minInputLength: NonNullable<Props['minInputLength']>
}

type _DropdownSearch = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _DropdownSearch }