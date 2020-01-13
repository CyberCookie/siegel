import { PropsComponentThemed } from '../ui_utils'


type ListElement = {
    title: React.ReactNode,
    children: ListElement[]
}

type Props = {
    soloOpen?: boolean,
    dropdownIcon: React.ReactNode,
    list: ListElement[],
    builder?: (title: React.ReactNode) => ({ className: string, elem: React.ReactNode })
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
}


export { Props, DefaultProps, ListElement }