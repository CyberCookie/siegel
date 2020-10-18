import type { PropsComponentThemed, CoreIUComponent } from '../../ui_utils'
import type { InputTagProps } from '../input_field_attributes'


type State = {
    selectedOption?: ID
    searchString: string | undefined
}
type Store = [ State, React.Dispatch<React.SetStateAction<State>> ]

type ThemeKeys = 'field' | 'options'| 'option' | 'label' | 'label_text' | '_with_suggestions' |
    keyof InputTagProps['theme']

type Props = {
    onChange: (id: ID, e: React.MouseEvent | React.FocusEvent, payload?: any) => void
    searchOptions: Indexable<{
        title: React.ReactNode
        value: string
        className?: string
        payload?: any
    }>
    onSearch?: (searchValue: string, e: React.ChangeEvent | React.MouseEvent, payload?: any) => void
    label?: React.ReactNode
    minInputLength?: number
    payload?: any
    showOnFocus?: boolean
    selected?: ID
} & PropsComponentThemed<ThemeKeys> & Omit<InputTagProps, 'theme'>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    minInputLength: NonNullable<Props['minInputLength']>
}

type MergedProps = Props & DefaultProps

type _DropdownSearch = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, _DropdownSearch, Store, State }