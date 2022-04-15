import React from 'react'

import type { PropsComponentThemed, CoreIUComponent } from '../_internals/types'
import type { Props as RangerProps } from '../Ranger'


type State = {
    anchorPos: number
    anchorFraction: number
    activeSlider: null | HTMLDivElement
    activeSliderArrValueIndex: undefined | number
}

type Option = {
    value: string
    label?: React.ReactNode
    className?: string
    payload?: any
}


type Theme = {
    anchors_wrapper?: string
    anchor?: string
    anchor__active?: string
    children_wrapper?: string
}

type Props = PropsComponentThemed<Theme, {
    value: string[]
    options: Option[]
    onChange?(
        values: {
            value: Option['value']
            optionIndex: number
        }[],
        e: MouseEvent | React.MouseEvent
    ): void
    rangerTheme?: RangerProps['theme']
    onRangePickStart?: RangerProps['onRangePickStart']
    onRangePickFinish?: RangerProps['onRangePickFinish']
    rangersCrossBehavior?: RangerProps['rangersCrossBehavior']
    rangePickIcon?: RangerProps['rangePickIcon']
    refApi?: RangerProps['refApi']
    label?: RangerProps['label']
    disabled?: RangerProps['disabled']
    children?: React.ReactNode
}>

type DefaultProps = NonNullableKeys<{
    theme: Required<Props['theme']>
}>

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component, State
}