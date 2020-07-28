import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type ThemeKeys = 'content' | 'close'

type Props = {
    onClose: (e: React.MouseEvent) => void
    closeIcon?: React.ReactNode
    content?: React.ReactNode
    attributes?: ComponentAttributes
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
    closeIcon: NonNullable<Props['closeIcon']>
}

type MergedProps = Props & DefaultProps

type _Popup = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, MergedProps, _Popup }