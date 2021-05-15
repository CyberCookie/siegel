import React from 'react'
import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../../ui_utils'


type DoubleValue = [ number, number ]

type ThemeKeys = 'children' | 'range_slider' | 'range_area' | 'label'
    | '_disabled' | 'range__selected' | 'range__unselected' | 'range_slider__active' | 'range_slide__in_progress'

type Props = {
    value: number | DoubleValue
    onChange(value: Props['value'], e: MouseEvent | React.MouseEvent): void
    onRangePickStart?:(e: React.MouseEvent) => void
    onRangePickFinish?:(e?: MouseEvent) => void
    rangersCrossBehavior?: 'stop' | 'move' | 'cross'
    rangePickIcon?: React.ReactNode
    label?: React.ReactNode
    attributes?: ComponentAttributes<HTMLDivElement>
    disabled?: boolean
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    rangersCrossBehavior: NonNullable<Props['rangersCrossBehavior']>
    rangePickIcon: NonNullable<Props['rangePickIcon']>
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type _Ranger = CoreIUComponent<Props, DefaultProps>


export type { Props, DefaultProps, MergedProps, _Ranger, DoubleValue }