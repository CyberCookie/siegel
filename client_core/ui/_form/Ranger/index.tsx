import React, { useState, useLayoutEffect } from 'react'

import isE from '../../../utils/is_exists'
import { extractProps, applyRefApi } from '../../ui_utils'
import addChildren from '../../children'
import type { _Ranger, Props, MergedProps, DoubleValue } from './types'

import styles from './styles.sass'


type RangeCrossTypeMap = {
    [key in NonNullable<Props['rangersCrossBehavior']>]: key
}

type GetRangeElement = (key: string, className: string, width: number) => JSX.Element
type GetRangePickerElement = (key: string, props: MergedProps, width: number) => JSX.Element

type State = {
    anchorPos: number
    anchorFraction: number
    activeSlider: null | HTMLDivElement
    activeSliderArrValueIndex: undefined | number
}


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
    <div key={key} className={className} style={{ width: width + '%' }} />
)
const getRangePicker: GetRangePickerElement = (key, { theme, rangePickIcon }, left) => (
    <div  key={key} children={rangePickIcon} data-slider={key[1] || ''}
        style={{ left: left + '%' }}
        className={`${theme.range_slider} ${innerRamgeSliderClassName}`} />
)

function getRangePickers(
    mergedProps: MergedProps,
    valueValidated: MergedProps['value'],
    isDoubleValue: boolean
) {

    const { theme } = mergedProps;

    if (isDoubleValue) {
        const [ from, to ] = (valueValidated as DoubleValue)
        const fromPercent = from * 100
        const toPercent = to * 100

        const unselectedFirstPercent = fromPercent;
        const selectedPercent = toPercent - fromPercent;
        const unselectedLastPercent = 100 - toPercent;


        return <>
            { getRange('u0', theme.range__unselected, unselectedFirstPercent) }
            { getRangePicker('r0', mergedProps, unselectedFirstPercent) }
            { getRange('s', theme.range__selected, selectedPercent) }
            { getRangePicker('r1', mergedProps, toPercent) }
            { getRange('u1', theme.range__unselected, unselectedLastPercent) }
        </>
    } else {
        const selectedRangePercent = (valueValidated as number) * 100
        const unselectedRangePercent = 100 - selectedRangePercent;


        return <>
            { getRange('s', theme.range__selected, selectedRangePercent) }
            { getRangePicker('r', mergedProps, selectedRangePercent) }
            { getRange('u', theme.range__unselected, unselectedRangePercent) }
        </>
    }
}

const toDefaultState = (state = {} as State) => {
    state.anchorPos = state.anchorFraction = 0
    state.activeSlider = null;
    state.activeSliderArrValueIndex = undefined;

    return state
}

const Ranger: _Ranger = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Ranger.defaults, props, false)
        :   (props as MergedProps)

    const {
        theme, className, refApi, attributes, label, disabled, onChange, value, rangersCrossBehavior
    } = mergedProps;
    
    const state = useState(toDefaultState())[0]

    useLayoutEffect(() => {
        return () => { onSlideFinish() }
    }, [])


    const isDoubleValue = Array.isArray(value)
    let valueValidated: number | DoubleValue;
    if (isDoubleValue) {
        valueValidated = (value as DoubleValue)
            .sort()
            .map(validateValue) as DoubleValue
    } else valueValidated = validateValue(value as number)


    const rangeAreaProps: { className: string, children: JSX.Element, onMouseDown?: typeof onSlideStart} = {
        className: `${theme.range_area} ${innerRangeAreaClassName}`,
        children: getRangePickers(mergedProps, valueValidated, isDoubleValue)
    }

    const rootProps = { className }
    disabled
        ?   (rootProps.className += ` ${theme._disabled}`)
        :   (rangeAreaProps.onMouseDown = onSlideStart)

    refApi && applyRefApi(rootProps, mergedProps)
    attributes && Object.assign(rootProps, attributes)


    function onSlideStart(e: React.MouseEvent) {
        const rangeAreaElement = e.currentTarget as HTMLDivElement;
        const {
            x: rangeAreaOffsetX,
            width: rangeAreaWidth
        } = rangeAreaElement.getBoundingClientRect()
        const { clientX, x } = e.nativeEvent;

        const rangeAreaPosXFraction = +((clientX - rangeAreaOffsetX) / rangeAreaWidth).toFixed(2)


        let activeSlider: HTMLDivElement;
        let activeSliderArrValueIndex: number;
        if (isDoubleValue) {
            let minimalDistanceToRangeSlider = rangeAreaWidth;
            for (let i = 0, l = (valueValidated as DoubleValue).length; i < l; i++) {
                const rangeSliderPosFraction = (valueValidated as DoubleValue)[i]
                const distanceToRangeSlider = Math.abs(rangeSliderPosFraction - rangeAreaPosXFraction)

                if (distanceToRangeSlider < minimalDistanceToRangeSlider) {
                    activeSlider = rangeAreaElement.children[(i * 2) + 1] as HTMLDivElement;
                    activeSliderArrValueIndex = i;
                    minimalDistanceToRangeSlider = distanceToRangeSlider
                } else break
            }

            if ((valueValidated as DoubleValue)[activeSliderArrValueIndex!] != rangeAreaPosXFraction) {
                (valueValidated as DoubleValue)[activeSliderArrValueIndex!] = rangeAreaPosXFraction;
                onChange(valueValidated, e)
            }
        } else {
            activeSlider = rangeAreaElement.children[1] as HTMLDivElement;
            valueValidated != rangeAreaPosXFraction && onChange(rangeAreaPosXFraction, e)
        }
        
        activeSlider!.classList.add(theme.range_slider__active)

        state.anchorPos = x;
        state.anchorFraction = rangeAreaPosXFraction;
        state.activeSlider = activeSlider!;
        state.activeSliderArrValueIndex = activeSliderArrValueIndex!;
        
        
        window.addEventListener('mousemove', onSlide)
        window.addEventListener('mouseup', onSlideFinish)
    }

    function onSlide(e: MouseEvent) {
        const { anchorPos, anchorFraction, activeSlider, activeSliderArrValueIndex } = state;

        const deltaPX = e.x - anchorPos;
        if (deltaPX) {
            const parentWidth = ((activeSlider as HTMLDivElement).parentNode as HTMLDivElement).clientWidth;
            const newValue = validateValue(anchorFraction + deltaPX / parentWidth)

            if (newValue != anchorFraction) {
                if (isE(activeSliderArrValueIndex)) {

                    const isStopRangerBehavior = rangersCrossBehavior == rangerCrossTypesMap.stop;
                    if (isStopRangerBehavior || rangersCrossBehavior == rangerCrossTypesMap.cross) {
                        const opositeArrValueIndex = activeSliderArrValueIndex ^ 1
                        const opositeArrValue = (valueValidated as DoubleValue)[opositeArrValueIndex]

                        const isOverlapRight = !activeSliderArrValueIndex && newValue >= opositeArrValue;
                        const isOverlapLeft = activeSliderArrValueIndex && newValue <= opositeArrValue;

                        if (isOverlapRight || isOverlapLeft) {
                            if (isStopRangerBehavior) {
                                (valueValidated as DoubleValue)[activeSliderArrValueIndex] = opositeArrValue;
                                onChange(valueValidated, e)
                                return
                            } else {
                                activeSlider!.classList.remove(theme.range_slider__active)

                                state.activeSliderArrValueIndex = opositeArrValueIndex;

                                state.activeSlider = (activeSlider!.parentNode as HTMLDivElement)
                                    .querySelector(`[data-slider='${opositeArrValueIndex}']`)
                                ;(state.activeSlider as HTMLDivElement).classList.add(theme.range_slider__active)
                            }
                        }
                    }

                    (valueValidated as DoubleValue)[activeSliderArrValueIndex] = newValue;
                    onChange(valueValidated, e)
                } else onChange(newValue, e)
            }
        }   
    }

    function onSlideFinish() {
        state.activeSlider?.classList.remove(theme.range_slider__active)

        toDefaultState(state)

        window.removeEventListener('mousemove', onSlide)
        window.removeEventListener('mouseup', onSlideFinish)
    }


    return (
        <div { ...rootProps }>
            { label && <div className={theme.label} children={label} /> }

            <div { ...rangeAreaProps } />
            
            { addChildren(rootProps, theme) }
        </div>
    )
}
Ranger.defaults = {
    rangersCrossBehavior: rangerCrossTypesMap.stop,
    rangePickIcon: '+',
    theme: {
        root: componentID,
        children: componentID + '_children',
        range_area: componentID + '_range_area',
        range_slider: componentID + '_range_slider',
        label: componentID + '_label',
        range_slide__in_progress: componentID + '_range_slide__in_progress',
        range_slider__active: componentID + '_range_slider__active',
        range__selected: componentID + '_range__selected',
        range__unselected: componentID + '_range__unselected',
        _disabled: componentID + '__disabled'
    }
}
Ranger.ID = componentID;


export { componentID }
export default Ranger