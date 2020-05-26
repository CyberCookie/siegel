import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type ThemeKeys = 'search_dropdown__with_suggestions' | 'search_dropdown__filled_field' | 'search_field' | 'options'
    | 'label' | 'label_text' | '_disabled'

type Props = {
    optionBuilder: (searchOption: any) => React.ReactNode
    onChange: (searchValue: string, e: React.ChangeEvent | React.MouseEvent, payload: any) => void
    searchOptions: any[]
    value: string
    label?: React.ReactNode
    disabled?: boolean
    placeholder?: string
    minInputLength?: number
    closeIcon?: React.ReactNode
    searchIcon?: React.ReactNode
    autofocus?: boolean
    payload?: any
    inputAttributes?: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
    attributes?: ComponentAttributes
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    minInputLength: NonNullable<Props['minInputLength']>
}

type _DropdownSearch = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _DropdownSearch }