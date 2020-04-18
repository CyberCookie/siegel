import React, { useLayoutEffect } from 'react'

import isTouchScreen from '../../utils/is_touchscreen'
import { extractProps } from '../ui_utils'
import { State, HTMLSwipeMouseEvent, _Swipe } from './types'


const componentID = '-ui-swipe'

const _isTouchScreen = isTouchScreen()
const passiveEv = { passive: true }

const Swipe: _Swipe = (props, withDefaults) => {
    const { className, children, xAxis, deltaPos, onSwipe, attributes } = withDefaults
        ?   (props as _Swipe['defaults'] & typeof props)
        :   extractProps(Swipe.defaults, props)

    let swipeRootAttributes: React.HTMLAttributes<HTMLDivElement> = { className, children }
    isTouchScreen
        ?   (swipeRootAttributes.onTouchStart = onMouseDown)
        :   (swipeRootAttributes.onMouseDown = onMouseDown);
    attributes && (swipeRootAttributes = Object.assign(swipeRootAttributes, attributes))

    useLayoutEffect(() => removeTouchEvents, [])


    const state: State = {
        mouseDownPos: null,
        swipeStart: false,
        blocked: false
    }

    function getMousePos(e: HTMLSwipeMouseEvent) {
        const { touches, x, y } = (e as MouseEvent & TouchEvent)

        return _isTouchScreen
            ?   (xAxis ? touches[0].screenX : touches[0].screenY)
            :   (xAxis ? x : y) 
    }

    function removeTouchEvents() {
        if (_isTouchScreen) {
            window.removeEventListener('touchend', onMouseUp)
            window.removeEventListener('touchmove', onMouseMove)
        } else {
            window.removeEventListener('mouseup', onMouseUp)
            window.removeEventListener('mousemove', onMouseMove)
        }
    }

    function onMouseDown(e: React.MouseEvent | React.TouchEvent) {
        e.stopPropagation()

        state.mouseDownPos = getMousePos(e.nativeEvent)
        state.swipeStart = true;

        if (_isTouchScreen) {
            window.addEventListener('touchend', onMouseUp, passiveEv)
            window.addEventListener('touchmove', onMouseMove, passiveEv)
        } else {
            window.addEventListener('mouseup', onMouseUp, passiveEv)
            window.addEventListener('mousemove', onMouseMove, passiveEv)
        }
    }
    
    function onMouseUp(e: HTMLSwipeMouseEvent) {
        e.stopPropagation()
        
        state.swipeStart = false;
        state.blocked = false;
        removeTouchEvents()
    }

    function onMouseMove(e: HTMLSwipeMouseEvent) {
        const { swipeStart, mouseDownPos } = state;
        let blocked = state.blocked;

        if (mouseDownPos && swipeStart && !blocked) {
            const deltaPosition = getMousePos(e) - mouseDownPos;

            if (Math.abs(deltaPosition) > deltaPos) {
                onSwipe(deltaPosition < 0, e)
                blocked = true
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


export * from './types'
export { componentID }
export default Swipe