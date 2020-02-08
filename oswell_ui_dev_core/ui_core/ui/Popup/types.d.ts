import { PropsComponentThemed } from '../ui_utils'


type Props = {
    closeIcon?: React.ReactNode
    content?: React.ReactNode
    onClose: (e: React.MouseEvent) => void
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
    closeIcon: NonNullable<Props['closeIcon']>
}


export { Props, DefaultProps }