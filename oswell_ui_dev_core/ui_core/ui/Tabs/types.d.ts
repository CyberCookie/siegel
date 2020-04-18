import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type ThemeKeys = 'label_wrapper' | 'tab_label' | 'tab_label__active'
    | 'tab_content' | 'tab_content__empty'

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
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type _Tabs = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Tabs }