import React from 'react'

import extractProps from '../_internals/props_extract'
import Ranger, { Props as RangerProps, DoubleValue } from '../Ranger'
import type { MergedProps, Props, Component } from './types'


type AnchorPositions = {
    positionsSorted: number[]
    posToValueMap: Record<number, string>
    valueToPosMap: Record<string, number>
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

const Stepper: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Ranger.defaults, props, false)
        :   (props as MergedProps)

    const {
        options, onChange, selectedFrom, selectedTo, theme, rangetProps
    } = mergedProps


    const anchorPositions: AnchorPositions = {
        positionsSorted: [],
        posToValueMap: {},
        valueToPosMap: {}
    }
    const { positionsSorted, posToValueMap, valueToPosMap } = anchorPositions


    const optionsCount = options.length
    let rangerChildren
    if (optionsCount > 2) {
        const percentsPerAnchor = 100 / ((optionsCount - 1) * 100)

        const innerSelectFrom = selectedFrom || options[0].value
        const innerSelectTo = selectedTo || options[optionsCount - 1].value
        let selectingInProgress: boolean

        const anchorsElements = options.map((anchorConfig, i) => {
            const { value, label, className } = anchorConfig

            const anchorPosition = i * percentsPerAnchor
            positionsSorted.push(anchorPosition)
            posToValueMap[anchorPosition] = value
            valueToPosMap[value] = anchorPosition

            const isStartAnchor = value == innerSelectFrom
            const isEndAnchor = value == innerSelectTo
            const isStartOrEnd = isStartAnchor || isEndAnchor


            let _className = theme.anchor
            className && (_className += ` ${className}`)
            if (selectingInProgress || isStartOrEnd) {
                _className += ` ${theme.anchor__active}`
            }

            if (selectingInProgress !== false && isStartOrEnd) {
                selectingInProgress = isEndAnchor
                    ?   false
                    :   isStartAnchor
            }


            return (
                <div key={ i } className={ _className } children={ label }
                    style={{ '--ui-ranger_anchors_index': i } as CSSWithVariables} />
            )
        })
        rangerChildren = (
            <div className={ theme.anchors_wrapper } children={ anchorsElements }
                style={{ '--ui-ranger_anchors_count': optionsCount } as CSSWithVariables} />
        )
    }

    const _rangerProps = Object.assign(rangetProps, {
        className: theme.root,
        value: [
            selectedFrom ? valueToPosMap[selectedFrom] : 0,
            selectedTo ? valueToPosMap[selectedTo] : 1
        ],
        attributes: {
            children: rangerChildren
        },
        rangersCrossBehavior: 'cross'
    } as RangerProps)
    onChange && (_rangerProps.onChange = (value: DoubleValue, e) => {
        const [ fromPos, toPos ] = value.map(rangeValue => (
            getClosestNumberFromArray(positionsSorted, rangeValue))
        ) as DoubleValue

        onChange(posToValueMap[fromPos], posToValueMap[toPos], e)
    })


    return <Ranger { ..._rangerProps } />
}
Stepper.defaults = {
    theme: {
        root: '',
        anchors_wrapper: '',
        anchor: '',
        anchor__active: ''
    }
}
Stepper.recursiveMergeProps = ['rangetProps']
Stepper.ID = componentID


export default Stepper
export type { Props }