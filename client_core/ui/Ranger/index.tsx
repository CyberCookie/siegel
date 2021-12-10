//TODO: vertical mode


import React, { useState, useLayoutEffect } from 'react'

import isExists from '../../utils/is/exists'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import type {
    State, RangeCrossTypeMap, GetRangeElement, GetRangePickerElement,
    Component, MergedProps,
    DoubleValue, Props
} from './types'

import styles from './styles.sass'


const componentID = '-ui-ranger'

const innerRangeAreaClassName = styles[componentID + '_inner_range_area']
const innerRamgeSliderClassName = styles[componentID + '_inner_range_slider']

const rangerCrossTypesMap: RangeCrossTypeMap = {
    stop: 'stop',
    move: 'move',
    cross: 'cross'
} as const


const validateValue = (value: number) => (
    value > 1
        ?   1
        :   value < 0
            ?   0
            :   +value.toFixed(2)
)

const getRange: GetRangeElement = (key, className, width) => (
    <div key={ key } className={ className } style={{ width: width + '%' }} />
)
const getRangePicker: GetRangePickerElement = (key, { theme, rangePickIcon }, left) => (
    <div  key={ key } children={ rangePickIcon } data-slider={ key[1] || '' }
        style={{ left: left + '%' }}
        className={ `${theme.range_slider} ${innerRamgeSliderClassName}` } />
)

function getRangePickers(
    mergedProps: MergedProps,
    valueValidated: MergedProps['value'],
    isDoubleValue: boolean
) {

    const { theme } = mergedProps

    if (isDoubleValue) {
        const [ from, to ] = (valueValidated as DoubleValue)
        const fromPercent = from * 100
        const toPercent = to * 100

        const unselectedFirstPercent = fromPercent
        const selectedPercent = toPercent - fromPercent
        const unselectedLastPercent = 100 - toPercent


        return <>
            { getRange('u0', theme.range__unselected, unselectedFirstPercent) }
            { getRangePicker('r0', mergedProps, unselectedFirstPercent) }
            { getRange('s', theme.range__selected, selectedPercent) }
            { getRangePicker('r1', mergedProps, toPercent) }
            { getRange('u1', theme.range__unselected, unselectedLastPercent) }
        </>
    } else {
        const selectedRangePercent = (valueValidated as number) * 100
        const unselectedRangePercent = 100 - selectedRangePercent


        return <>
            { getRange('s', theme.range__selected, selectedRangePercent) }
            { getRangePicker('r', mergedProps, selectedRangePercent) }
            { getRange('u', theme.range__unselected, unselectedRangePercent) }
        </>
    }
}

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
        theme, className, refApi, attributes, label, disabled, value, rangersCrossBehavior,
        onChange, onRangePickStart, onRangePickFinish
    } = mergedProps

    const state = useState(toDefaultState())[0]

    useLayoutEffect(() => {
        return () => { onSlideFinish() }
    }, [])


    const isDoubleValue = Array.isArray(value)
    let valueValidated: number | DoubleValue
    if (isDoubleValue) {
        valueValidated = (value as DoubleValue)
            .sort()
            .map(validateValue) as DoubleValue
    } else valueValidated = validateValue(value as number)


    const rootProps = { className }

    const rangeAreaProps: { className: string, children: JSX.Element, onMouseDown?: typeof onSlideStart} = {
        className: `${theme.range_area} ${innerRangeAreaClassName}`,
        children: getRangePickers(mergedProps, valueValidated, isDoubleValue)
    }

    disabled
        ?   (rootProps.className += ` ${theme._disabled}`)
        :   onChange
            ?   (rangeAreaProps.onMouseDown = onSlideStart)
            :   (rootProps.className += ` ${theme._readonly}`)

    refApi && applyRefApi(rootProps, mergedProps)
    attributes && Object.assign(rootProps, attributes)



    function onSlideStart(e: React.MouseEvent) {
        onRangePickStart && onRangePickStart(e)

        const rangeAreaElement = e.currentTarget as HTMLDivElement
        const {
            x: rangeAreaOffsetX,
            width: rangeAreaWidth
        } = rangeAreaElement.getBoundingClientRect()
        const { clientX, x: posX } = e.nativeEvent

        const rangeAreaPosXFraction = +((clientX - rangeAreaOffsetX) / rangeAreaWidth).toFixed(2)


        let activeSlider: HTMLDivElement
        let activeSliderArrValueIndex: number
        if (isDoubleValue) {
            let minimalDistanceToRangeSlider = rangeAreaWidth
            for (let i = 0, l = (valueValidated as DoubleValue).length; i < l; i++) {
                const rangeSliderPosFraction = (valueValidated as DoubleValue)[i]
                const distanceToRangeSlider = Math.abs(rangeSliderPosFraction - rangeAreaPosXFraction)

                if (distanceToRangeSlider < minimalDistanceToRangeSlider) {
                    activeSlider = rangeAreaElement.children[(i * 2) + 1] as HTMLDivElement
                    activeSliderArrValueIndex = i
                    minimalDistanceToRangeSlider = distanceToRangeSlider
                } else break
            }

            if ((valueValidated as DoubleValue)[activeSliderArrValueIndex!] != rangeAreaPosXFraction) {
                (valueValidated as DoubleValue)[activeSliderArrValueIndex!] = rangeAreaPosXFraction
                onChange!(valueValidated, e)
            }
        } else {
            activeSlider = rangeAreaElement.children[1] as HTMLDivElement
            valueValidated != rangeAreaPosXFraction && onChange!(rangeAreaPosXFraction, e)
        }

        activeSlider!.classList.add(theme.range_slider__active)

        state.anchorPos = posX
        state.anchorFraction = rangeAreaPosXFraction
        state.activeSlider = activeSlider!
        state.activeSliderArrValueIndex = activeSliderArrValueIndex!


        window.addEventListener('mousemove', onSlide)
        window.addEventListener('mouseup', onSlideFinish)
    }

    function onSlide(e: MouseEvent) {
        const { anchorPos, anchorFraction, activeSlider, activeSliderArrValueIndex } = state

        const deltaPX = e.x - anchorPos
        if (deltaPX) {
            const parentWidth = ((activeSlider as HTMLDivElement).parentNode as HTMLDivElement).clientWidth
            const newValue = validateValue(anchorFraction + deltaPX / parentWidth)

            if (newValue != anchorFraction) {
                if (isExists(activeSliderArrValueIndex)) {

                    const isStopRangerBehavior = rangersCrossBehavior == rangerCrossTypesMap.stop
                    if (isStopRangerBehavior || rangersCrossBehavior == rangerCrossTypesMap.cross) {
                        const opositeArrValueIndex = activeSliderArrValueIndex ^ 1
                        const opositeArrValue = (valueValidated as DoubleValue)[opositeArrValueIndex]

                        const isOverlapRight = !activeSliderArrValueIndex && newValue >= opositeArrValue
                        const isOverlapLeft = activeSliderArrValueIndex && newValue <= opositeArrValue

                        if (isOverlapRight || isOverlapLeft) {
                            if (isStopRangerBehavior) {
                                (valueValidated as DoubleValue)[activeSliderArrValueIndex] = opositeArrValue
                                onChange!(valueValidated, e)
                                return
                            } else {
                                activeSlider!.classList.remove(theme.range_slider__active)

                                state.activeSliderArrValueIndex = opositeArrValueIndex

                                state.activeSlider = (activeSlider!.parentNode as HTMLDivElement)
                                    .querySelector(`[data-slider='${opositeArrValueIndex}']`)
                                ;(state.activeSlider as HTMLDivElement).classList.add(theme.range_slider__active)
                            }
                        }
                    }

                    (valueValidated as DoubleValue)[activeSliderArrValueIndex] = newValue
                    onChange!(valueValidated, e)
                } else onChange!(newValue, e)
            }
        }
    }

    function onSlideFinish(e?: MouseEvent) {
        onRangePickFinish && onRangePickFinish(e)

        state.activeSlider?.classList.remove(theme.range_slider__active)

        toDefaultState(state)

        window.removeEventListener('mousemove', onSlide)
        window.removeEventListener('mouseup', onSlideFinish)
    }


    const rangerElement = <div { ...rangeAreaProps } />
    const children = addChildren(rootProps, theme)


    return (
        <div { ...rootProps }>
            { label && <div className={ theme.label } children={ label } /> }

            { children
                ?   <div className={ theme.ranger_content_wrapper }>
                        { children }
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
        children: '',
        ranger_content_wrapper: '',
        range_area: '',
        range_slider: '',
        label: '',
        range_slide__in_progress: '',
        range_slider__active: '',
        range__selected: '',
        range__unselected: '',
        _disabled: '',
        _readonly: ''
    }
}
Ranger.ID = componentID


export { componentID }
export default Ranger
export type { DoubleValue, Props }