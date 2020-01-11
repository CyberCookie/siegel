import React, { useLayoutEffect } from 'react'

import isTouchScreen from '../../utils/is_touchscreen'
import { setDefaultProps, extractProps, PropsComponentBase } from '../ui_utils'

type HTMLSwipeMouseEvent = MouseEvent | TouchEvent

type Props = {
    children?: React.ReactNode,
    xAxis?: boolean,
    deltaPos?: number,
    onSwipe: (dirrection: boolean, e: HTMLSwipeMouseEvent) => void
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<PropsComponentBase['className']>,
    deltaPos: number
}

type State = {
    mouseDownPos: number | null,
    swipeStart: boolean,
    blocked: boolean
}


const componentID = '-ui-swipe'

const defaults: DefaultProps = {
    className: componentID,
    deltaPos: 60
}

const _isTouchScreen = isTouchScreen()
const passiveEv = { passive: true }

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}


const Swipe = (props: Props) => {
    let { className, children, xAxis, deltaPos, onSwipe } = extractProps(defaults, props);

    let wrapperAttr: React.HTMLAttributes<HTMLDivElement> = { className, children }
    isTouchScreen
        ?   (wrapperAttr.onTouchStart = onMouseDown)
        :   (wrapperAttr.onMouseDown = onMouseDown);

    useLayoutEffect(() => removeTouchEvents, [])


    let state: State = {
        mouseDownPos: null,
        swipeStart: false,
        blocked: false
    }

    function getMousePos(e: HTMLSwipeMouseEvent) {
        let { touches, x, y } = (e as MouseEvent & TouchEvent)

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
        let { swipeStart, blocked, mouseDownPos } = state;

        if (mouseDownPos && swipeStart && !blocked) {
            let deltaPosition = getMousePos(e) - mouseDownPos;

            if (Math.abs(deltaPosition) > deltaPos) {
                onSwipe(deltaPosition < 0, e)
                blocked = true
            }
        }
    }


    return <div {...wrapperAttr} />
}


export { setDefaults }
export default Swipe