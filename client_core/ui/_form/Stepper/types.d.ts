import React from 'react'

import type { PropsComponentThemed, CoreIUComponent } from '../../ui_utils'
import type { Props as RangerProps } from '../Ranger'


type State = {
    anchorPos: number
    anchorFraction: number
    activeSlider: null | HTMLDivElement
    activeSliderArrValueIndex: undefined | number
}

type ThemeKeys = 'anchors_wrapper' | 'anchor' | 'anchor__active'

type Props = {
    selectedFrom: string
    options: {
        value: string
        label?: React.ReactNode
        className?: string
    }[]
    onChange?(
        selectedFrom: Props['selectedFrom'],
        selectedTo: Props['selectedTo'],
        e: MouseEvent | React.MouseEvent
    ): void
    selectedTo?: string
    rangetProps?: Omit<RangerProps, 'value' | 'onChange'>
} & PropsComponentThemed<ThemeKeys>

type DefaultProps = {
    theme: NonNullable<Required<Props['theme']>>
}

type MergedProps = Props & DefaultProps

type Component = CoreIUComponent<Props, DefaultProps>


export type {
    Props, DefaultProps, MergedProps, Component, State
}