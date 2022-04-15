import React, { useState } from 'react'

import extractProps from '../_internals/props_extract'
import Ranger, { Props as RangerProps } from '../Ranger'
import type { MergedProps, Component } from './types'


type State = {
    rangerValues: number[]
    rangerValuesString: string
    anchorPositionsSorted: number[]
    anchorToOptionData: Indexable<{ value: string, index: number }>
    valueToAnchorMap: Indexable<number>
}


const componentID = '-ui-stepper'

function getClosestNumberFromArray(sortedValuesArray: number[], value: number) {
    let lastDiff = Infinity
    let lastClosestValue

    for (let i = 0, l = sortedValuesArray.length; i < l; i++) {
        const arrValue = sortedValuesArray[i]
        const diff = Math.abs(value - arrValue)

        if (diff >= lastDiff) return lastClosestValue
        else {
            lastDiff = diff
            lastClosestValue = arrValue
        }
    }


    return lastClosestValue
}

function toDefaultState(state: Partial<State>) {
    state.rangerValues = []
    state.rangerValuesString = ''
    state.anchorPositionsSorted = []
    state.anchorToOptionData = {}
    state.valueToAnchorMap = {}

    return state as State
}

const Stepper: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Ranger.defaults, props, false)
        :   (props as MergedProps)

    const {
        className, options, onChange, value, theme, children, refApi,
        disabled, label, onRangePickFinish, onRangePickStart, rangePickIcon, rangersCrossBehavior,
        rangerTheme
    } = mergedProps

    // To have fresh data within Ranger.onChange handler
    const state = useState( toDefaultState({}) )[0]
    state.rangerValuesString && toDefaultState(state)


    const optionsCount = options.length
    let rangerChildren
    if (optionsCount > 2) {
        const isSingle = value.length == 1
        const percentsPerAnchor = 100 / ((optionsCount - 1) * 100)

        const valuesCounter: Indexable<number> = {}
        value.forEach(v => {
            valuesCounter[v]
                ?   valuesCounter[v]++
                :   (valuesCounter[v] = 1)
        })

        let anchorInRange: boolean

        const anchorsElements = options.map((anchorConfig, index) => {
            const { value, label, className } = anchorConfig

            const anchorPosition = index * percentsPerAnchor

            state.anchorPositionsSorted.push(anchorPosition)
            state.anchorToOptionData[anchorPosition] = { value, index }
            state.valueToAnchorMap[value] = anchorPosition


            let _className = theme.anchor
            className && (_className += ` ${className}`)

            let isAnchorActive
            const valuesCount = valuesCounter[value]
            if (valuesCount) {
                isAnchorActive = true
                anchorInRange = !(isSingle || anchorInRange || (valuesCount == 2))
            }

            if (anchorInRange || isAnchorActive) {
                _className += ` ${theme.anchor__active}`
            }


            return (
                <div key={ index } className={ _className } children={ label }
                    style={{ '--ui-ranger_anchors_index': index } as CSSWithVariables} />
            )
        })
        rangerChildren = (
            <div className={ theme.anchors_wrapper } children={ anchorsElements }
                style={{ '--ui-ranger_anchors_count': optionsCount } as CSSWithVariables} />
        )
    }


    value.forEach(optionValue => {
        const rangerValue = state.valueToAnchorMap[optionValue]

        state.rangerValues.push(rangerValue)
        state.rangerValuesString += `-${rangerValue}`
    })


    const _rangerProps: RangerProps = {
        className, refApi, disabled, label, rangePickIcon, rangersCrossBehavior,
        theme: rangerTheme,
        onRangePickFinish, onRangePickStart,
        value: state.rangerValues,
        children: children
            ?   <div className={ theme.children_wrapper }>
                    { children }
                    { rangerChildren }
                </div>
            :   rangerChildren
    }
    onChange && (_rangerProps.onChange = (newRangerValues, e) => {
        const { anchorToOptionData, rangerValuesString, anchorPositionsSorted } = state

        const newAnchoredRangerValue: number[] = []
        let newRangerValuesString = ''

        const stepperValues = newRangerValues.map(rangeValue => {
            const anchorValue = getClosestNumberFromArray(anchorPositionsSorted, rangeValue)!
            const { value, index } = anchorToOptionData[anchorValue]

            newAnchoredRangerValue.push(anchorValue)
            newRangerValuesString += `-${anchorValue}`

            return {
                value,
                optionIndex: index
            }
        })

        rangerValuesString != newRangerValuesString && onChange(stepperValues, e)
    })


    return <Ranger { ..._rangerProps } />
}
Stepper.defaults = {
    theme: {
        root: '',
        anchors_wrapper: '',
        children_wrapper: '',
        anchor: '',
        anchor__active: ''
    }
}
Stepper.ID = componentID


export default Stepper
export * from './types'