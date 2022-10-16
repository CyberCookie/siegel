import React, { useLayoutEffect } from 'react'

import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import isTouchScreen from '../../utils/is_touchscreen'
import applyRefApi from '../_internals/ref_apply'

import type { HTMLSwipeMouseEvent, Component, DefaultProps, Props } from './types'


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
            className, children, xAxis, deltaPos, onSwipe, rootTagAttributes, refApi
        } = props

        let swipeRootAttributes: Props['rootTagAttributes'] = {
            className,
            children
        }
        _isTouchScreen
            ?   (swipeRootAttributes.onTouchStart = onMouseDown)
            :   (swipeRootAttributes.onMouseDown = onMouseDown)

        refApi && (applyRefApi(swipeRootAttributes, props))

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


        return <div { ...swipeRootAttributes } />
    }
)


export default Swipe
export { componentID }
export type { Component, Props }