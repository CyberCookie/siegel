import { PropsComponentBase, ComponentAttributes, CoreIUComponent } from '../ui_utils'


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
    separator?: React.ReactNode
    attributes?: ComponentAttributes
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<Props['className']>
    separator: NonNullable<Props['separator']>
}

type _Breadcrumbs = CoreIUComponent<Props, DefaultProps>


export { Props, DefaultProps, _Breadcrumbs }