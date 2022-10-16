import React from 'react'

import type { PropsComponentThemed, CoreUIComponent } from '../_internals/types'
import type { Props as RangerProps } from '../Ranger'


type State = {
    rangerValues: number[]
    rangerValuesString: string
    anchorPositionsSorted: number[]
    anchorToOptionData: Indexable<{ value: string, index: number }>
    valueToAnchorMap: Indexable<number>
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
    rangerMemoDeps?: RangerProps['memoDeps']
    onRangePickStart?: RangerProps['onRangePickStart']
    onRangePickFinish?: RangerProps['onRangePickFinish']
    rangersCrossBehavior?: RangerProps['rangersCrossBehavior']
    rangePickIcon?: RangerProps['rangePickIcon']
    refApi?: RangerProps['refApi']
    isVertical?: RangerProps['isVertical']
    label?: RangerProps['label']
    disabled?: RangerProps['disabled']
    children?: React.ReactNode
}>

type DefaultProps = NonNullableKeys<{
    theme: Props['theme']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, Component, State }