import React, { useState } from 'react'

import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import Ranger, { Props as RangerProps } from '../Ranger'

import type { State, Props, DefaultProps, Component } from './types'


const _undef = undefined
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

const Stepper = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            anchors_wrapper: _undef,
            children_wrapper: _undef,
            anchor: _undef,
            anchor__active: _undef
        }
    },
    props => {

        const {
            className, options, onChange, value, theme, children, refApi,
            disabled, label, onRangePickFinish, onRangePickStart, rangePickIcon,
            rangersCrossBehavior, isVertical, rangerTheme, rangerMemoDeps
        } = props

        // To have fresh data within Ranger.onChange handler
        const state = useState( toDefaultState({}) )[0]
        state.rangerValuesString && toDefaultState(state)


        const optionsCount = options.length
        let rangerChildren
        if (optionsCount > 2) {
            const isSingle = value.length == 1
            const percentsPerAnchor = 100 / ((optionsCount - 1) * 100)

            const valuesCounter: Obj<number> = {}
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



                let isAnchorActive
                const valuesCount = valuesCounter[value]
                if (valuesCount) {
                    isAnchorActive = true
                    anchorInRange = !(isSingle || anchorInRange || (valuesCount == 2))
                }

                const _className = applyClassName(theme.anchor, [
                    [ className, true ],
                    [ theme.anchor__active, anchorInRange || isAnchorActive ]
                ])


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
            className, refApi, disabled, label, rangePickIcon, rangersCrossBehavior, isVertical,
            memoDeps: rangerMemoDeps,
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
)


export default Stepper
export type { Component, Props }