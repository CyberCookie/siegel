import type { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../_internals/types'


type _Attributes = ComponentAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>

type Props = PropsComponentBase<{
    type?: _Attributes['type']
    value?: React.ReactNode
    disabled?: _Attributes['disabled']
    onClick?: _Attributes['onClick']
    attributes?: _Attributes
}>

type DefaultProps = {
    type: NonNullable<Props['type']>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, Component }