import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../ui_utils'


type DynamicCrumb = {
    dynamicCrumb: string
}
type Crumb = {
    crumb: string | ((path: string, name: string) => void)
}
type BreadcrumbsConfigByPath = {
    children?: {
        [path: string]: BreadcrumbsConfigByPath
    }
} & (
    (Partial<DynamicCrumb> & Crumb)
        |   (DynamicCrumb & Partial<Crumb>)
)
type BreadcrumbConfig = {
    [path: string]: BreadcrumbsConfigByPath
}


type ThemeKeys = 'link'

type Props = {
    onChange(path: string, e: React.MouseEvent): void
    config: BreadcrumbConfig
    location: string
    separator?: React.ReactNode
    attributes?: ComponentAttributes<HTMLDivElement>
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    className: NonNullable<Props['className']>
    separator: NonNullable<Props['separator']>
    theme: Required<NonNullable<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type _Breadcrumbs = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, _Breadcrumbs, BreadcrumbConfig }