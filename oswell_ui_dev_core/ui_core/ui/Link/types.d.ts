import { PropsComponentBase } from '../ui_utils'


type Props = {
    path: string,
    title: React.ReactNode
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>
}


export { Props, DefaultProps }