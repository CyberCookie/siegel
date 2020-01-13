import { PropsComponentThemed } from '../ui_utils'


type Props = {
    searchPlaceholder?: string,
    minInputLength?: number,
    closeIcon?: React.ReactChild,
    searchIcon?: React.ReactChild,
    autofocus?: boolean,
    optionBuilder: (searchOption: any) => React.ReactChild,
    onSearch: (searchValue: string) => void,
    searchOptions: any[]
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>,
    minInputLength: NonNullable<Props['minInputLength']>
}


export { Props, DefaultProps }