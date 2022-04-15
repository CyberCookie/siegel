import React from 'react'

import type {
    PropsComponentThemed, NewComponentAttributes, CoreIUComponent
} from '../_internals/types'


type RangeCrossTypeMap = {
    [key in NonNullable<Props['rangersCrossBehavior']>]: key
}

type State = {
    anchorPos: number
    anchorFraction: number
    activeSlider: null | HTMLDivElement
    activeSliderArrValueIndex: undefined | number
}


type Theme = {
    _readonly?: string
    _disabled?: string
    _single_picker?: string
    children?: string
    label?: string
    ranger_content_wrapper?: string
    range_area?: string
    range__selected?: string
    range__unselected?: string
    range_slider?: string
    range_slider__active?: string
}

type Props = PropsComponentThemed<Theme, {
    value: number[]
    onChange?(value: Props['value'], e: MouseEvent | React.MouseEvent): void
    onRangePickStart?:(e: React.MouseEvent) => void
    onRangePickFinish?:(e?: MouseEvent) => void
    children?: React.ReactNode
    rangersCrossBehavior?: 'stop' | 'move' | 'cross'
    rangePickIcon?: React.ReactNode
    label?: React.ReactNode
    rootTagAttributes?: NewComponentAttributes<HTMLDivElement>
    disabled?: boolean
}>

type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
    rangersCrossBehavior: Props['rangersCrossBehavior']
    rangePickIcon: Props['rangePickIcon']
}>

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component, State, RangeCrossTypeMap
}