import type { PropsComponentThemed, CoreIUComponent } from '../../ui_utils'
import type { Props as InputProps } from '../Input/types'


type State = {
    selectedOption?: ID
    searchString: string | undefined
}
type Store = [ State, React.Dispatch<React.SetStateAction<State>> ]

type ThemeKeys = 'options'| 'option' | '_with_suggestions' | Exclude<keyof NonNullable<InputProps['theme']>, 'extra' | 'textarea'>

type Props = {
    onChange: (id: ID, e: React.MouseEvent | React.FocusEvent, payload?: any) => void
    searchOptions: Indexable<{
        title: React.ReactNode
        value: string
        className?: string
        payload?: any
    }>
    onSearch?: (
        searchValue: string,
        e: Parameters<NonNullable<InputProps['onChange']>>[1],
        payload?: any
    ) => void
    minInputLength?: number
    payload?: any
    showOnFocus?: boolean
    selected?: ID
} & PropsComponentThemed<ThemeKeys> & Omit<InputProps, 'theme' | 'type' | 'value' | 'attributes' | 'payload' | 'onBlur' | 'onFocus' | 'onChange'>

type DefaultProps = {
    className: NonNullable<Required<Props['className']>>
    theme: NonNullable<Required<Props['theme']>>
    minInputLength: NonNullable<Props['minInputLength']>
}

type MergedProps = Props & DefaultProps

type _DropdownSearch = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, _DropdownSearch, Store, State }