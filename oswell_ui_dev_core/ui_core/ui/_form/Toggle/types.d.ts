import { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type Props = {
    labelLeft?: React.ReactNode
    labelRight?: React.ReactNode
    toggleIcon?: React.ReactNode
    isToggled?: boolean
    onChange?: (e: React.MouseEvent) => void
    attributes?: ComponentAttributes
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<Props['theme']>
}

type _Toggle = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Toggle }