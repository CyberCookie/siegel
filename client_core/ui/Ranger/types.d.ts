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
    /** Root tag state if no props.onChange hanler provided */
    _readonly?: string

    /** Root tag state if component is disabled */
    _disabled?: string

    /** Root tag state if there is only one picker (props.value.length == 1) */
    _single_picker?: string

    /** Root tag state if props.isVertical is true */
    _vertical?: string

    /** Children element renders along ranger element */
    children?: string

    /** Ranger label */
    label?: string

    /** Wraps children and range area elements if props.children is provided */
    ranger_content_wrapper?: string

    /** Range area element */
    range_area?: string

    /** Range element that is a part of selected range */
    range__selected?: string

    /** Range element that is not a part of selected range */
    range__unselected?: string

    /** Range slider element */
    range_slider?: string

    /** Range slider element if currently draggable */
    range_slider__active?: string
}

type Props = PropsComponentThemed<Theme, {
    /** Range pick value */
    value: number[]

    /**
     * Triggered when you change selected range
     *
     * @param value new range value
     * @param event mousedown event
     */


    /* eslint-disable-next-line */
    onChange?(value: Props['value'], event: MouseEvent | React.MouseEvent<HTMLDivElement>): void

    /**
     * Triggered when start slide dragging
     *
     * @param event mousedown event
     */
    onRangePickStart?:(event: React.MouseEvent<HTMLDivElement>) => void

    /**
     * Triggered when finish slide dragging
     *
     * @param event mousedown event
     */
    onRangePickFinish?:(event: MouseEvent | undefined) => void

    /** Enables vertical mode */
    isVertical?: boolean

    /** Any element that will be rendered along ranger area */
    children?: React.ReactNode

    /** Determined range pick behavior when it 'bumps' another range pick */
    rangersCrossBehavior?: 'stop' | 'move' | 'cross'

    /** Range picker icon */
    rangePickIcon?: React.ReactNode

    /** Range picker label */
    label?: React.ReactNode

    /** */
    rootTagAttributes?: CoreUIReactTagAttributes<HTMLDivElement>

    /** Disable range picker */
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