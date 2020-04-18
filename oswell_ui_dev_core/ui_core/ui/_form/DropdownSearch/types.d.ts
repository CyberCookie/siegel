import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type ThemeKeys = 'search_dropdown__with_suggestions' | 'search_dropdown__filled_field' | 'search_field' | 'options'

type Props = {
    optionBuilder: (searchOption: any) => React.ReactChild
    onChange: (searchValue: string, e: React.ChangeEvent, payload: any) => void
    searchOptions: any[]
    searchPlaceholder?: string
    minInputLength?: number
    closeIcon?: React.ReactChild
    searchIcon?: React.ReactChild
    autofocus?: boolean
    payload?: any
    inputAttributes?: ComponentAttributes<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>
    attributes?: ComponentAttributes
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>,
    minInputLength: NonNullable<Props['minInputLength']>
}

type _DropdownSearch = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _DropdownSearch }