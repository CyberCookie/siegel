import React from 'react'
import type { PropsComponentThemed, ComponentAttributes, CoreIUComponent } from '../_internals/types'


type RangeCrossTypeMap = {
    [key in NonNullable<Props['rangersCrossBehavior']>]: key
}

type GetRangeElement = (key: string, className: string, width: number) => JSX.Element
type GetRangePickerElement = (key: string, props: MergedProps, width: number) => JSX.Element

type State = {
    anchorPos: number
    anchorFraction: number
    activeSlider: null | HTMLDivElement
    activeSliderArrValueIndex: undefined | number
}


type DoubleValue = [ number, number ]

type ThemeKeys = 'children' | 'ranger_content_wrapper' | 'range_slider' | 'range_area' | 'label'
    | '_readonly' | '_disabled' | 'range__selected' | 'range__unselected' | 'range_slider__active' | 'range_slide__in_progress'

type Props = {
    value: number | DoubleValue
    onChange?(value: Props['value'], e: MouseEvent | React.MouseEvent): void
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

type Component = CoreIUComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component, DoubleValue, State, RangeCrossTypeMap,
    GetRangeElement, GetRangePickerElement
}