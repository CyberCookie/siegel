import React, { useLayoutEffect,
    ReactNode, HTMLAttributes } from 'react'

import isTouchScreen from 'core-utils/is_touchscreen'

type HTMLSwipeMouseEvent = MouseEvent | TouchEvent

interface Props {
    className?: string,
    children?: ReactNode,
    xAxis?: boolean,
    deltaPos?: number,
    onSwipe: (dirrection: boolean, e: HTMLSwipeMouseEvent) => void
}

interface State {
    mouseDownPos: number | null,
    swipeStart: boolean,
    blocked: boolean
}


const _isTouchScreen = isTouchScreen()
const passiveEv = { passive: true }

const Swipe = (props: Props) => {
    let { children, xAxis, deltaPos = 60, onSwipe } = props;
    let wrapperProps: HTMLAttributes<HTMLDivElement> = {
        className: '-ui-tap-slide',
        children
    }
    props.className && (wrapperProps.className += ` ${props.className}`)

    isTouchScreen
        ?   (wrapperProps.onTouchStart = onMouseDown)
        :   (wrapperProps.onMouseDown = onMouseDown);

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


    return <div {...wrapperProps} />
}


export default Swipe