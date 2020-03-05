import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type Props = {
    data: {
        id: ID
        content: React.ReactNode
        label: React.ReactNode
        payload?: any
    }[],
    onChange: (id: ID, e: React.MouseEvent, payload: any) => void
    activeTab: ID
    attributes?: ComponentAttributes
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
}

type _Tabs = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Tabs }