import { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type Props = {
    builder: (x: any) => any
    updateInterval?: number
    zeroing?: boolean
    attributes?: ComponentAttributes
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>
    updateInterval: NonNullable<Props['updateInterval']>
    zeroing: NonNullable<Props['zeroing']>
}

type _Clocks = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Clocks }