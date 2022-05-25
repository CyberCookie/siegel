//TODO: vertical mode


import React, { useState, useLayoutEffect } from 'react'

import mergeTagAttributes from '../_internals/merge_tag_attributes'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import { getRangeAreaElements, normalizeValue } from './helpers'
import type {
    State, RangeCrossTypeMap, Component, Props, MergedProps
} from './types'

import styles from './styles.sass'


const componentID = '-ui-ranger'

const rangerCrossTypesMap: RangeCrossTypeMap = {
    stop: 'stop',
    move: 'move',
    cross: 'cross'
} as const

function toDefaultState(state = {} as State) {
    state.anchorPos = state.anchorFraction = 0
    state.activeSlider = null
    state.activeSliderArrValueIndex = undefined

    return state
}

const Ranger: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Ranger.defaults, props, false)
        :   (props as MergedProps)

    const {
        theme, className, refApi, rootTagAttributes, label, disabled, value, rangersCrossBehavior,
        onChange, onRangePickStart, onRangePickFinish, children
    } = mergedProps

    const state = useState(toDefaultState())[0]

    useLayoutEffect(() => {
        return () => { onSlideFinish() }
    }, [])


    const valueValidated = value.sort().map(normalizeValue)

    const isSingle = value.length == 1

    let rootProps = { className }
    isSingle && (rootProps.className += ` ${theme._single_picker}`)

    const rangeAreaProps: { className: string, children: JSX.Element, onMouseDown?: typeof onSlideStart} = {
        className: `${theme.range_area} ${styles.range_area}`,
        children: getRangeAreaElements(mergedProps, valueValidated, isSingle)
    }

    disabled
        ?   (rootProps.className += ` ${theme._disabled}`)
        :   onChange
            ?   (rangeAreaProps.onMouseDown = onSlideStart)
            :   (rootProps.className += ` ${theme._readonly}`)

    refApi && applyRefApi(rootProps, mergedProps)
    rootTagAttributes && (rootProps = mergeTagAttributes(rootProps, rootTagAttributes))


    function onSlideStart(e: React.MouseEvent) {
        onRangePickStart?.(e)

        const rangeAreaElement = e.currentTarget as HTMLDivElement
        const {
            x: rangeAreaOffsetX,
            width: rangeAreaWidth
        } = rangeAreaElement.getBoundingClientRect()
        const { clientX, x: posX } = e.nativeEvent

        const rangeAreaPosXFraction = +((clientX - rangeAreaOffsetX) / rangeAreaWidth).toFixed(2)


        let activeSlider: HTMLDivElement
        if (isSingle) {
            activeSlider = rangeAreaElement.children[1] as HTMLDivElement
            valueValidated[0] != rangeAreaPosXFraction && onChange!([ rangeAreaPosXFraction ], e)

        } else {
            let activeSliderArrValueIndex: number
            let minimalDistanceToRangeSlider = rangeAreaWidth

            for (let i = 0, l = valueValidated.length; i < l; i++) {
                const rangeSliderPosFraction = valueValidated[i]
                const distanceToRangeSlider = Math.abs(rangeSliderPosFraction - rangeAreaPosXFraction)

                if (distanceToRangeSlider < minimalDistanceToRangeSlider) {
                    activeSlider = rangeAreaElement.children[(i * 2) + 1] as HTMLDivElement
                    activeSliderArrValueIndex = i
                    minimalDistanceToRangeSlider = distanceToRangeSlider
                } else break
            }

            if (valueValidated[activeSliderArrValueIndex!] != rangeAreaPosXFraction) {
                valueValidated[activeSliderArrValueIndex!] = rangeAreaPosXFraction
                onChange!(valueValidated, e)
            }

            state.activeSliderArrValueIndex = activeSliderArrValueIndex!
        }

        activeSlider!.classList.add(theme.range_slider__active)

        state.anchorPos = posX
        state.anchorFraction = rangeAreaPosXFraction
        state.activeSlider = activeSlider!


        addEventListener('mousemove', onSlide)
        addEventListener('mouseup', onSlideFinish)
    }

    function onSlide(e: MouseEvent) {
        const { anchorPos, anchorFraction, activeSlider, activeSliderArrValueIndex } = state

        const deltaPX = e.x - anchorPos
        if (deltaPX) {
            const parentWidth = ((activeSlider as HTMLDivElement).parentNode as HTMLDivElement).clientWidth
            const newValue = normalizeValue(anchorFraction + deltaPX / parentWidth)

            if (newValue != anchorFraction) {
                if (isSingle) onChange!([ newValue ], e)
                else {
                    const isStopRangerBehavior = rangersCrossBehavior == rangerCrossTypesMap.stop
                    if (isStopRangerBehavior || rangersCrossBehavior == rangerCrossTypesMap.cross) {
                        const pairedArrValueIndex = activeSliderArrValueIndex! ^ 1 // flip first bit
                        const pairedArrValue = valueValidated[pairedArrValueIndex]

                        const isOverlap = pairedArrValueIndex % 2
                            ?   newValue > pairedArrValue
                            :   newValue < pairedArrValue

                        if (isOverlap) {
                            if (isStopRangerBehavior) {
                                valueValidated[activeSliderArrValueIndex!] = pairedArrValue
                                onChange!(valueValidated, e)
                                return
                            } else {
                                activeSlider!.classList.remove(theme.range_slider__active)

                                state.activeSliderArrValueIndex = pairedArrValueIndex

                                state.activeSlider = (activeSlider!.parentNode as HTMLDivElement)
                                    .querySelector(`[data-slider='${pairedArrValueIndex}']`)
                                ;(state.activeSlider as HTMLDivElement).classList.add(theme.range_slider__active)
                            }
                        }
                    }

                    valueValidated[activeSliderArrValueIndex!] = newValue
                    onChange!(valueValidated, e)
                }
            }
        }
    }

    function onSlideFinish(e?: MouseEvent) {
        onRangePickFinish?.(e)

        state.activeSlider?.classList.remove(theme.range_slider__active)

        toDefaultState(state)

        removeEventListener('mousemove', onSlide)
        removeEventListener('mouseup', onSlideFinish)
    }


    const rangerElement = <div { ...rangeAreaProps } />
    const _children = children && addChildren(children, theme)


    return (
        <div { ...rootProps }>
            { label && <div className={ theme.label } children={ label } /> }

            { _children
                ?   <div className={ theme.ranger_content_wrapper }>
                        { _children }
                        { rangerElement }
                    </div>
                :   rangerElement
            }
        </div>
    )
}
Ranger.defaults = {
    rangersCrossBehavior: rangerCrossTypesMap.stop,
    rangePickIcon: '+',
    theme: {
        root: '',
        _single_picker: '',
        _disabled: '',
        _readonly: '',
        children: '',
        ranger_content_wrapper: '',
        range_area: '',
        label: '',
        range_slider: '',
        range_slider__active: '',
        range__selected: '',
        range__unselected: ''
    }
}
Ranger.ID = componentID


export default Ranger
export { componentID }
export type { Component, Props }