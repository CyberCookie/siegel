import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type Option = {
    id: ID
    content: React.ReactNode
    className?: string
}

type ThemeKeys = 'option' | 'option__selected' | '_disabled'

type Props = {
    onChange: (id: ID, e: React.MouseEvent) => void
    options: Option[]
    disabled?: boolean
    attributes?: ComponentAttributes
} & PropsComponentThemed<ThemeKeys>
    & ({ multiple: true, selected: Set<ID> } | { multiple?: false, selected: ID })

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type _Radio = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, _Radio, Option }