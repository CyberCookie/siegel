import { PropsComponentBase } from '../ui_utils'


type Props = {
    updateInterval?: number,
    zeroing?: boolean,
    builder: (x: any) => any
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>,
    updateInterval: NonNullable<Props['updateInterval']>,
    zeroing: NonNullable<Props['zeroing']>
}


export { Props, DefaultProps }