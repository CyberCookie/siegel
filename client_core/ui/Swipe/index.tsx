import React, { useLayoutEffect } from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import component from '../_internals/component'
import isTouchScreen from '../../utils/is_touchscreen'
import applyRefApi from '../_internals/ref_apply'

import type {
    Component, DefaultProps, Props,
    HTMLSwipeMouseEvent, RootTagInnerProps
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

const Swipe = component<Props, DefaultProps>(
    componentID,
    { deltaPos: 60 },
    props => {

        const {
            className, children, xAxis, deltaPos, rootTagAttributes,
            onSwipe, onTouchStart, onMouseDown
        } = props

        let swipeRootAttributes: RootTagInnerProps = {
            className,
            children
        }
        _isTouchScreen
            ?   (swipeRootAttributes.onTouchStart = onMouseDownInner)
            :   (swipeRootAttributes.onMouseDown = onMouseDownInner)

        applyRefApi(swipeRootAttributes, props)
        swipeRootAttributes = resolveTagAttributes(swipeRootAttributes, rootTagAttributes)


        useLayoutEffect(() => { removeTouchEvents?.() }, [])

        let removeTouchEvents: () => void


        function onMouseDownInner(e: React.MouseEvent | React.TouchEvent) {
            _isTouchScreen
                ?   onTouchStart?.(e as React.TouchEvent)
                :   onMouseDown?.(e as React.MouseEvent)

            if (!e.defaultPrevented) {
                e.stopPropagation()

                const mouseDownPos = getMousePos(e.nativeEvent, xAxis)
                let swipeStart = true
                let isBlocked = false


                if (_isTouchScreen) {
                    addEventListener('touchend', onMouseUp, passiveEv)
                    addEventListener('touchmove', onMouseMove, passiveEv)
                } else {
                    addEventListener('mouseup', onMouseUp, passiveEv)
                    addEventListener('mousemove', onMouseMove, passiveEv)
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
                        removeEventListener('touchend', onMouseUp)
                        removeEventListener('touchmove', onMouseMove)
                    } else {
                        removeEventListener('mouseup', onMouseUp)
                        removeEventListener('mousemove', onMouseMove)
                    }
                }
            }
        }


        return <div { ...swipeRootAttributes } />
    }
)


export default Swipe
export { componentID }
export type { Component, Props }