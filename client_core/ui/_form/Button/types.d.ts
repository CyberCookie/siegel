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
    className: NonNullable<Props['className']>
    type: NonNullable<Props['type']>
}

type MergedProps = Props & DefaultProps

type _Button = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, _Button }