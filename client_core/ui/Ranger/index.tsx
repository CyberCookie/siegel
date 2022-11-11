import React, { useState, useLayoutEffect } from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import { getRangeAreaElements, normalizeValue } from './helpers'

import type { ReactTagAttributes } from '../_internals/types'
import type { State, RangeCrossTypeMap, Component, Props, DefaultProps } from './types'

import styles from './styles.sass'


const _undef = undefined
const componentID = '-ui-ranger'

const rangerCrossTypesMap: RangeCrossTypeMap = {
    stop: 'stop',
    move: 'move',
    cross: 'cross'
} as const

function toDefaultState(state = {} as State) {
    state.anchorPos = state.anchorFraction = 0
    state.activeSlider = null
    state.activeSliderArrValueIndex = _undef

    return state
}

const Ranger = component<Props, DefaultProps>(
    componentID,
    {
        rangersCrossBehavior: rangerCrossTypesMap.stop,
        theme: {
            root: _undef,
            _vertical: _undef,
            _single_picker: _undef,
            _disabled: _undef,
            _readonly: _undef,
            children: _undef,
            ranger_content_wrapper: _undef,
            range_area: _undef,
            label: _undef,
            range_slider: _undef,
            range_slider__active: _undef,
            range__selected: _undef,
            range__unselected: _undef
        }
    },
    props => {

        const {
            theme, className, rootTagAttributes, label, disabled, value, rangersCrossBehavior,
            onChange, onRangePickStart, onRangePickFinish, children, isVertical
        } = props

        const state = useState(toDefaultState())[0]

        useLayoutEffect(() => () => { onSlideFinish() }, [])


        const valueValidated = value.sort().map(normalizeValue)

        const isSingle = value.length == 1
        const isReadonly = !disabled && !onChange

        let rootProps = {
            className: applyClassName(className, [
                [ theme._single_picker, isSingle ],
                [ theme._vertical, isVertical ],
                [ styles._vertical, isVertical ],
                [ theme._disabled, disabled ],
                [ theme._readonly, isReadonly ]
            ])
        }
        applyRefApi(rootProps, props)
        rootProps = resolveTagAttributes(rootProps, rootTagAttributes)


        const rangeAreaProps: ReactTagAttributes<HTMLDivElement> = {
            className: applyClassName(styles.range_area, [[ theme.range_area, true ]]),
            children: getRangeAreaElements(props, valueValidated, isSingle),
            onMouseDown: !disabled && onChange ? onSlideStart : undefined
        }

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

            theme.range_slider__active && activeSlider!.classList.add(theme.range_slider__active)

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
                                    theme.range_slider__active && activeSlider!.classList.remove(theme.range_slider__active)

                                    state.activeSliderArrValueIndex = pairedArrValueIndex

                                    state.activeSlider = (activeSlider!.parentNode as HTMLDivElement)
                                        .querySelector(`[data-slider='${pairedArrValueIndex}']`)

                                    theme.range_slider__active
                                        &&  (state.activeSlider as HTMLDivElement).classList.add(theme.range_slider__active)
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

            theme.range_slider__active && state.activeSlider?.classList.remove(theme.range_slider__active)

            toDefaultState(state)

            removeEventListener('mousemove', onSlide)
            removeEventListener('mouseup', onSlideFinish)
        }


        const rangerElement = <div { ...rangeAreaProps } />
        const _children = addChildren(children, theme)


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