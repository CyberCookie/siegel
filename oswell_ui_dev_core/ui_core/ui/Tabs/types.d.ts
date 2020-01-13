import { PropsComponentThemed } from '../ui_utils'


type Props = {
    attributes?: React.Attributes,
    data: {
        id: ID,
        content: React.ReactNode,
        label: React.ReactNode
    }[],
    onTabClick: (id: ID) => void,
    activeTab: ID
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
}


export { Props, DefaultProps }