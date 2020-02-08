import { PropsComponentThemed } from '../ui_utils'


type Props = {
    labelLeft?: React.ReactNode
    labelRight?: React.ReactNode
    toggleIcon?: React.ReactNode
    isToggled?: boolean
    onChange?: (e: React.MouseEvent) => void
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
}


export { Props, DefaultProps }