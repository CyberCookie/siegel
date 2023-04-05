import React from 'react'

import type { PropsComponentThemed, CoreUIComponent } from '../_internals/types'
import type { Props as RangerProps } from '../Ranger'


type State = {
    rangerValues: number[]
    rangerValuesString: string
    anchorPositionsSorted: number[]
    anchorToOptionData: Obj<{ value: string, index: number }>
    valueToAnchorMap: Obj<number>
}

type Option = {
    /** Option value */
    value: string

    /** Label text */
    label?: React.ReactNode

    /** Option label className */
    className?: string

    /** Some data to store for later usege */
    payload?: any
}


type Theme = {
    /** Wraps all dragable anchors */
    anchors_wrapper?: string

    /** Draggable anchors */
    anchor?: string

    /** Anchor state if included in selection range */
    anchor__active?: string

    /** Wraps provided children with children passed to Ranger component */
    children_wrapper?: string
}

type Props = PropsComponentThemed<Theme, {
    /** Stepper anchors tied to specific option */
    value: string[]

    /** Stepper option labels on top of Ranger component */
    options: Option[]

    /**
     * Triggered when Stepper value is change
     *
     * @param values change values
     * @param event mouseclick event
     */
    onChange?(
        values: {
            value: Option['value']
            optionIndex: number
        }[],
        event: Parameters<NonNullable<RangerProps['onChange']>>[1]
    ): void

    /** Stepper children element passed to Ranger along with stepper labels */
    children?: React.ReactNode

    /** Underlaying Ranger component props.theme */
    rangerTheme?: RangerProps['theme']

    /** Underlaying Ranger component props.memoDeps */
    rangerMemoDeps?: RangerProps['memoDeps']

    /** Underlaying Ranger component props.onRangePickStart */
    onRangePickStart?: RangerProps['onRangePickStart']

    /** Underlaying Ranger component props.onRangePickFinish */
    onRangePickFinish?: RangerProps['onRangePickFinish']

    /** Underlaying Ranger component props.rangersCrossBehavior */
    rangersCrossBehavior?: RangerProps['rangersCrossBehavior']

    /** Underlaying Ranger component props.rangePickIcon */
    rangePickIcon?: RangerProps['rangePickIcon']

    /** Underlaying Ranger component props.refApi */
    refApi?: RangerProps['refApi']

    /** Underlaying Ranger component props.isVertical */
    isVertical?: RangerProps['isVertical']

    /** Underlaying Ranger component props.label */
    label?: RangerProps['label']

    /** Underlaying Ranger component props.disabled */
    disabled?: RangerProps['disabled']
}>

type DefaultProps = NonNullableProps<{
    theme: Props['theme']
}>

type Component = CoreUIComponent<Props, DefaultProps>


export type { Props, DefaultProps, Component, State }