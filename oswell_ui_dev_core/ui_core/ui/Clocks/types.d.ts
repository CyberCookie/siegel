import { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../ui_utils'
import { DateParsed } from '../../utils/date/date_parse'


type Props = {
    builder: (x: DateParsed) => any
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