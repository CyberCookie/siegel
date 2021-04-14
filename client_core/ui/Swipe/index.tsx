import React, { useLayoutEffect } from 'react'

import isTouchScreen from '../../utils/is_touchscreen'
import { extractProps, applyRefApi } from '../ui_utils'
import type { HTMLSwipeMouseEvent, _Swipe, Props, MergedProps } from './types'


const componentID = '-ui-swipe'

const _isTouchScreen = isTouchScreen()
const passiveEv = { passive: true }

const Swipe: _Swipe = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Swipe.defaults, props, false)
        :   (props  as MergedProps)

    const { className, children, xAxis, deltaPos, onSwipe, attributes, refApi } = mergedProps;

    let swipeRootAttributes: Props['attributes'] = { className, children }
    _isTouchScreen
        ?   (swipeRootAttributes.onTouchStart = onMouseDown)
        :   (swipeRootAttributes.onMouseDown = onMouseDown)

    refApi && (applyRefApi(swipeRootAttributes, mergedProps))
    attributes && (swipeRootAttributes = Object.assign(swipeRootAttributes, attributes))

    useLayoutEffect(() => { removeTouchEvents && removeTouchEvents() }, [])

    let removeTouchEvents: () => void;


    function onMouseDown(e: React.MouseEvent | React.TouchEvent) {
        e.stopPropagation()

        function getMousePos(e: HTMLSwipeMouseEvent) {
            const { touches, x, y } = (e as MouseEvent & TouchEvent)
    
            return _isTouchScreen
                ?   (xAxis ? touches[0].screenX : touches[0].screenY)
                :   (xAxis ? x : y)
        }

        const mouseDownPos = getMousePos(e.nativeEvent)
        let swipeStart = true;
        let isBlocked = false;


        if (_isTouchScreen) {
            window.addEventListener('touchend', onMouseUp, passiveEv)
            window.addEventListener('touchmove', onMouseMove, passiveEv)
        } else {
            window.addEventListener('mouseup', onMouseUp, passiveEv)
            window.addEventListener('mousemove', onMouseMove, passiveEv)
        }

        function onMouseUp(e: HTMLSwipeMouseEvent) {
            e.stopPropagation()
            
            swipeStart = false;
            isBlocked = false;
            removeTouchEvents()
        }
    
        function onMouseMove(e: HTMLSwipeMouseEvent) {
            if (mouseDownPos && swipeStart && !isBlocked) {
                const deltaPosition = getMousePos(e) - mouseDownPos;
    
                if (Math.abs(deltaPosition) > deltaPos) {
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


    return <div {...swipeRootAttributes} />
}
Swipe.defaults = {
    className: componentID,
    deltaPos: 60
}
Swipe.ID = componentID;


export { componentID }
export default Swipe
export * from './types'