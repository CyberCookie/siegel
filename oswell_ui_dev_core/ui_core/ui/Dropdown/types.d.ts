import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type ListElement = {
    title: React.ReactNode
    children: ListElement[]
}

type Props = {
    soloOpen?: boolean
    dropdownIcon: React.ReactNode
    list: ListElement[]
    builder?: (title: React.ReactNode, children?: ListElement[]) => ({ className: string, elem: React.ReactNode })
    attributes?: ComponentAttributes
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
}

type _Dropdown = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, ListElement, _Dropdown }