import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type ListElement = {
    title: React.ReactNode
    children: ListElement[]
}

type ThemeKeys = 'item_with_child' | 'item_title' | 'item_without_child'

type Props = {
    dropdownIcon: React.ReactNode
    list: ListElement[]
    soloOpen?: boolean
    builder?: (title: React.ReactNode, children?: ListElement[]) => ({ className: string, elem: React.ReactNode })
    attributes?: ComponentAttributes
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type _Dropdown = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, ListElement, _Dropdown }