import React, { useState, useLayoutEffect } from 'react'

import isExists from '../../utils/is/exists'
import extractProps from '../_internals/props_extract'
import addChildren from '../_internals/children'
import { getRootProps, getVisualElements } from './helpers'
import type { Component, MergedProps, SwitchSlide } from './types'


const componentID = '-ui-slider'

const Slider: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Slider.defaults, props, false)
        :   (props as MergedProps)

    const {
        store, theme, autoslideInterval, loop, withControls, children, slides
    } = mergedProps

    const [ curSlide, setSlide ] = store || useState(0)
    const slideDirectionState = useState({
        isLastDirectionForward: undefined as boolean | undefined
    })[0]
    const { isLastDirectionForward } = slideDirectionState

    const sliderRootProps = getRootProps(mergedProps)

    if (isExists(isLastDirectionForward)) {
        sliderRootProps.className += ` ${isLastDirectionForward ? theme._slided_forward : theme._slided_backward}`
    }


    useLayoutEffect(() => {
        const rootElement = sliderRootProps.ref.current as HTMLDivElement
        rootElement.style.setProperty(
            '--slide_width',
            (
                rootElement
                    .childNodes[ withControls ? 1 : 0 ]
                    .childNodes[ 0 ] as HTMLDivElement
            ).offsetWidth + 'px'
        )
    }, [])

    if (autoslideInterval) {
        useLayoutEffect(() => {
            const timeoutID = setTimeout(() => {
                switchSlide(curSlide + 1, true)
            }, autoslideInterval)

            return () => { clearTimeout(timeoutID) }
        }, [ curSlide ])
    }


    const switchSlide: SwitchSlide = (_nextSlide, isSlideNext, isControlClick) => {
        slideDirectionState.isLastDirectionForward = isSlideNext

        const lastIndex = slides.length - 1
        const nextSlide = isControlClick
            ?   _nextSlide
            :   _nextSlide > lastIndex
                ?   loop ? 0 : lastIndex
                :   _nextSlide < 0
                    ?   loop ? lastIndex : 0
                    :   _nextSlide


        setSlide(nextSlide)
    }


    const { pageControls, slidePages } = getVisualElements({ mergedProps, switchSlide, curSlide })


    return (
        <div { ...sliderRootProps }>
            { pageControls }
            { slidePages }

            { children && addChildren(children, theme) }
        </div>
    )
}
Slider.defaults = {
    theme: {
        root: '',
        children: '',
        slides_wrapper: '',
        slide: '',
        slide__active: '',
        slide__prev: '',
        slide__next: '',
        controls_wrapper: '',
        control: '',
        control__active: '',
        _slided_forward: '',
        _slided_backward: ''
    },
    swipeDelta: 30
}
Slider.ID = componentID


export { componentID }
export default Slider
export * from './types'