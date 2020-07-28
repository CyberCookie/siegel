import { PropsComponentThemed, CoreIUComponent } from '../../ui_utils'
import { InputTagProps } from '../input_field_attributes'


type FilterKey = {
    filter?: string | ((value: Props['value'], id: ID, index: number) => boolean)
}

type ThemeKeys = 'field' | 'options'| 'option' | 'label' | 'label_text' | '_with_suggestions' |
    keyof InputTagProps['theme']

type Props = {
    onChange: (searchValue: string, e: React.ChangeEvent | React.MouseEvent, payload?: any) => void
    onSelect: (id: ID, e: React.MouseEvent, payload?: any) => void
    searchOptions: ({
        id: ID
        title: React.ReactNode
        className?: string
        payload?: any
    } & FilterKey)[]
    label?: React.ReactNode
    minInputLength?: number
    payload?: any
} & PropsComponentThemed<ThemeKeys> & Omit<InputTagProps, 'theme'>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    minInputLength: NonNullable<Props['minInputLength']>
}

type MergedProps = Props & DefaultProps

type _DropdownSearch = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, MergedProps, _DropdownSearch }