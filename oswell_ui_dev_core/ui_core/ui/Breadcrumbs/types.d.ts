import { PropsComponentBase } from '../ui_utils'


type BreadcrumbsConfigByPath = {
    dynamicCrumb: string
    crumb: string | ((path: string, name: string) => void)
    nested: {
        [path: string]: BreadcrumbsConfigByPath
    }
}

type Props = {
    config: {
        [path: string]: BreadcrumbsConfigByPath
    }
    location: string
    attributes?: React.Attributes
    separator?: React.ReactNode
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>
    separator: NonNullable<Props['separator']>
}


export { Props, DefaultProps }