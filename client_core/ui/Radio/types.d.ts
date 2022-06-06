import type {
    PropsComponentThemed, NewComponentAttributes, CoreUIComponent
} from '../_internals/types'


type MultiSelectProps = {
    multiple: true
    selected: Set<string>
}
type SingleSelectProps = {
    multiple?: false
    selected: string
}


type Theme = {
    option?: string
    option__selected?: string
    _disabled?: string
}

type Props<_Payload = any> = PropsComponentThemed<Theme, {
    onChange(id: string, e: React.MouseEvent, payload: _Payload): void
    options: {
        id: string
        content: React.ReactNode
        className?: string
        payload?: _Payload
    }[]
    disabled?: boolean
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
}> & (MultiSelectProps | SingleSelectProps)

type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, MergedProps, Component, MultiSelectProps, SingleSelectProps }