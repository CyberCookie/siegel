import React, { useLayoutEffect } from 'react'

import mergeTagAttributes from '../_internals/merge_tag_attributes'
import isTouchScreen from '../../utils/is/touchscreen'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import type {
    HTMLSwipeMouseEvent, Component, MergedProps, Props
} from './types'


const componentID = '-ui-swipe'

const _isTouchScreen = isTouchScreen()
const passiveEv = { passive: true }

function getMousePos(e: HTMLSwipeMouseEvent, xAxis: Props['xAxis']) {
    const { touches, x, y } = (e as MouseEvent & TouchEvent)

    return _isTouchScreen
        ?   (xAxis ? touches[0].screenX : touches[0].screenY)
        :   (xAxis ? x : y)
}

const Swipe: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Swipe.defaults, props, false)
        :   (props  as MergedProps)

    const {
        className, children, xAxis, deltaPos, onSwipe, rootTagAttributes, refApi
    } = mergedProps

    let swipeRootAttributes: Props['rootTagAttributes'] = {
        className,
        children
    }
    _isTouchScreen
        ?   (swipeRootAttributes.onTouchStart = onMouseDown)
        :   (swipeRootAttributes.onMouseDown = onMouseDown)

    refApi && (applyRefApi(swipeRootAttributes, mergedProps))

    if (rootTagAttributes) {
        swipeRootAttributes = mergeTagAttributes(swipeRootAttributes, rootTagAttributes)
    }


    useLayoutEffect(() => { removeTouchEvents?.() }, [])

    let removeTouchEvents: () => void


    function onMouseDown(e: React.MouseEvent | React.TouchEvent) {
        e.stopPropagation()

        const mouseDownPos = getMousePos(e.nativeEvent, xAxis)
        let swipeStart = true
        let isBlocked = false


        if (_isTouchScreen) {
            window.addEventListener('touchend', onMouseUp, passiveEv)
            window.addEventListener('touchmove', onMouseMove, passiveEv)
        } else {
            window.addEventListener('mouseup', onMouseUp, passiveEv)
            window.addEventListener('mousemove', onMouseMove, passiveEv)
        }

        function onMouseUp(e: HTMLSwipeMouseEvent) {
            e.stopPropagation()

            swipeStart = false
            isBlocked = false
            removeTouchEvents()
        }

        function onMouseMove(e: HTMLSwipeMouseEvent) {
            if (mouseDownPos && swipeStart && !isBlocked) {
                const deltaPosition = getMousePos(e, xAxis) - mouseDownPos

                if (Math.abs(deltaPosition) > deltaPos!) {
                    onSwipe(deltaPosition < 0, e)
                    isBlocked = true
                }
            }
        }

        removeTouchEvents = () => {
            if (_isTouchScreen) {
                window.removeEventListener('touchend', onMouseUp)
                window.removeEventListener('touchmove', onMouseMove)
            } else {
                window.removeEventListener('mouseup', onMouseUp)
                window.removeEventListener('mousemove', onMouseMove)
            }
        }
    }


    return <div { ...swipeRootAttributes } />
}
Swipe.defaults = {
    deltaPos: 60
}
Swipe.ID = componentID


export { componentID }
export default Swipe
export * from './types'