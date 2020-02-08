import { PropsComponentBase } from '../ui_utils'


type Props = {
    type?: string
    value?: number | string
    disabled?: boolean
    wrapperAttr?: object
    onClick?: React.MouseEventHandler
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>
    type: NonNullable<Props['type']>
}


export { Props, DefaultProps }