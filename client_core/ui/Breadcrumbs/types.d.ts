import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type DynamicCrumb = {
    dynamicCrumb: string
}
type Crumb = {
    crumb: string | ((path: string, name: string) => void)
}
type BreadcrumbsConfigByPath = {
    nested: {
        [path: string]: BreadcrumbsConfigByPath
    }
} & (
    (Partial<DynamicCrumb> & Crumb)
        |   (DynamicCrumb & Partial<Crumb>)
)


type ThemeKeys = 'link'

type Props = {
    onChange: (path: string, e: React.MouseEvent) => void
    config: {
        [path: string]: BreadcrumbsConfigByPath
    }
    location: string
    separator?: React.ReactNode
    attributes?: ComponentAttributes
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    className: NonNullable<Props['className']>
    separator: NonNullable<Props['separator']>
    theme: Required<NonNullable<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type _Breadcrumbs = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, _Breadcrumbs, BreadcrumbsConfigByPath }