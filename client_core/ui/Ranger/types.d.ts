import React from 'react'

import type {
    PropsComponentThemed, CoreUIReactTagAttributes, CoreUIComponent
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
    _vertical?: string
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
    onChange?(value: Props['value'], event: MouseEvent | React.MouseEvent<HTMLDivElement>): void
    onRangePickStart?:(event: React.MouseEvent<HTMLDivElement>) => void
    onRangePickFinish?:(event: MouseEvent | undefined) => void
    isVertical?: boolean
    children?: React.ReactNode
    rangersCrossBehavior?: 'stop' | 'move' | 'cross'
    rangePickIcon?: React.ReactNode
    label?: React.ReactNode
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>
    disabled?: boolean
}>

type DefaultProps = NonNullableProps<{
    theme: Props['theme']
    rangersCrossBehavior: Props['rangersCrossBehavior']
}>

type MergedProps = Props & DefaultProps

type Component = CoreUIComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component, State, RangeCrossTypeMap
}