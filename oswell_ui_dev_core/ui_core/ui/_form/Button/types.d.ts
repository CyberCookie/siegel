import { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type _Attributes = ComponentAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>

type Props = {
    type?: _Attributes['type']
    value?: _Attributes['value']
    disabled?: _Attributes['disabled']
    onClick?: _Attributes['onClick']
    attributes?: _Attributes
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>
    type: NonNullable<Props['type']>
}

type _Button = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Button }