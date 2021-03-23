import type { PropsComponentThemed, CoreIUComponent, ComponentAttributes } from '../../ui_utils'
import type { Props as InputProps } from '../Input/types'


type State = {
    selectedOption?: ID
    searchString: string | undefined
}
type Store = [ State, React.Dispatch<React.SetStateAction<State>> ]

type ThemeKeys = 'options'| 'option' | '_with_suggestions' | '_disabled' | '_focused'

type Props = {
    onChange(id: ID, e: React.MouseEvent | React.FocusEvent, payload?: any): void
    searchOptions: {
        inputValue: string
        value: ID
        title?: React.ReactNode
        className?: string
        payload?: any
    }[]
    onSearch?(
        searchValue: string,
        e: Parameters<NonNullable<InputProps['onChange']>>[1]
    ): void
    attributes?: ComponentAttributes<HTMLDivElement>
    minInputLength?: number
    showOnFocus?: boolean
    showAll?: boolean
    selected?: ID,
    disabled?: boolean
    inputProps?: Omit<InputProps, 'className' | 'onChange' | 'value' | 'attributes'>
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    minInputLength: NonNullable<Props['minInputLength']>
}

type MergedProps = Props & DefaultProps

type _DropdownSearch = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, _DropdownSearch, Store, State }