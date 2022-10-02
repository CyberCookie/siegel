import React, { useState, useLayoutEffect } from 'react'

import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import { getRangeAreaElements, normalizeValue } from './helpers'

import type { ReactTagAttributes } from '../_internals/types'
import type { State, RangeCrossTypeMap, Component, Props } from './types'

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

const Ranger: Component = component(
    componentID,
    {
        rangersCrossBehavior: rangerCrossTypesMap.stop as Values<RangeCrossTypeMap>,
        rangePickIcon: '+',
        theme: {
            root: '',
            _vertical: '',
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
    },
    props => {

        const {
            theme, className, refApi, rootTagAttributes, label, disabled, value, rangersCrossBehavior,
            onChange, onRangePickStart, onRangePickFinish, children, isVertical
        } = props

        const state = useState(toDefaultState())[0]

        useLayoutEffect(() => () => { onSlideFinish() }, [])


        const valueValidated = value.sort().map(normalizeValue)

        const isSingle = value.length == 1

        let rootProps = { className }
        isSingle && (rootProps.className += ` ${theme._single_picker}`)
        isVertical && (rootProps.className += ` ${theme._vertical} ${styles._vertical}`)

        const rangeAreaProps: ReactTagAttributes<HTMLDivElement> = {
            className: `${theme.range_area} ${styles.range_area}`,
            children: getRangeAreaElements(props, valueValidated, isSingle)
        }

        disabled
            ?   (rootProps.className += ` ${theme._disabled}`)
            :   onChange
                ?   (rangeAreaProps.onMouseDown = onSlideStart)
                :   (rootProps.className += ` ${theme._readonly}`)

        refApi && applyRefApi(rootProps, props)
        rootTagAttributes && (rootProps = mergeTagAttributes(rootProps, rootTagAttributes))


        function onSlideStart(e: React.MouseEvent) {
            onRangePickStart?.(e)

            const rangeAreaElement = e.currentTarget as HTMLDivElement
            const {
                x: rangeAreaOffsetX,
                y: rangeAreaOffsetY,
                width: rangeAreaWidth,
                height: rangeAreaHeight
            } = rangeAreaElement.getBoundingClientRect()
            const {
                clientX, clientY,
                x: posX,
                y: posY
            } = e.nativeEvent

            const rangeAreaPosFraction = +(
                isVertical
                    ?   (clientY - rangeAreaOffsetY) / rangeAreaHeight
                    :   (clientX - rangeAreaOffsetX) / rangeAreaWidth
            ).toFixed(2)


            let activeSlider: HTMLDivElement
            if (isSingle) {
                activeSlider = rangeAreaElement.children[1] as HTMLDivElement
                valueValidated[0] != rangeAreaPosFraction && onChange!([ rangeAreaPosFraction ], e)

            } else {
                let activeSliderArrValueIndex: number
                let minimalDistanceToRangeSlider = rangeAreaWidth

                for (let i = 0, l = valueValidated.length; i < l; i++) {
                    const rangeSliderPosFraction = valueValidated[i]
                    const distanceToRangeSlider = Math.abs(rangeSliderPosFraction - rangeAreaPosFraction)

                    if (distanceToRangeSlider < minimalDistanceToRangeSlider) {
                        activeSlider = rangeAreaElement.children[(i * 2) + 1] as HTMLDivElement
                        activeSliderArrValueIndex = i
                        minimalDistanceToRangeSlider = distanceToRangeSlider

                    } else break
                }

                if (valueValidated[activeSliderArrValueIndex!] != rangeAreaPosFraction) {
                    valueValidated[activeSliderArrValueIndex!] = rangeAreaPosFraction
                    onChange!(valueValidated, e)
                }

                state.activeSliderArrValueIndex = activeSliderArrValueIndex!
            }

            activeSlider!.classList.add(theme.range_slider__active)

            state.anchorPos = isVertical ? posY : posX
            state.anchorFraction = rangeAreaPosFraction
            state.activeSlider = activeSlider!


            addEventListener('mousemove', onSlide)
            addEventListener('mouseup', onSlideFinish)
        }

        function onSlide(e: MouseEvent) {
            const { anchorPos, anchorFraction, activeSlider, activeSliderArrValueIndex } = state

            const deltaPX = (isVertical ? e.y : e.x) - anchorPos
            if (deltaPX) {
                const { clientWidth, clientHeight } = ((activeSlider as HTMLDivElement).parentNode as HTMLDivElement)
                const newValue = normalizeValue(
                    anchorFraction + deltaPX / (isVertical ? clientHeight : clientWidth)
                )

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
)


export default Ranger
export { componentID }
export type { Component, Props }