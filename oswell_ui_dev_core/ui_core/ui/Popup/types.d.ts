import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type Props = {
    closeIcon?: React.ReactNode
    content?: React.ReactNode
    onClose: (e: React.MouseEvent) => void
    attributes?: ComponentAttributes
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
    closeIcon: NonNullable<Props['closeIcon']>
}

type _Popup = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Popup }