import type { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type _Attributes = ComponentAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>

type Props = {
    type?: _Attributes['type']
    value?: React.ReactNode
    disabled?: _Attributes['disabled']
    onClick?: _Attributes['onClick']
    attributes?: _Attributes
} & PropsComponentBase

type DefaultProps = {
    type: NonNullable<Props['type']>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }