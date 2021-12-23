import React, { useState, useLayoutEffect, useRef } from 'react'

import isExists from '../../utils/is/exists'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import addChildren from '../_internals/children'
import Swipe from '../Swipe'
import type {
    Component, MergedProps, SwitchSlide, GetSliderVisualsParams,
    Props
} from './types'


const componentID = '-ui-slider'

function getSliderRootProps(mergedProps: MergedProps) {
    const { className, attributes, refApi } = mergedProps
    let result = {
        className,
        ref: (useRef() as React.MutableRefObject<HTMLDivElement>)
    }
    refApi && (applyRefApi(result, mergedProps))
    attributes && (result = Object.assign(result, attributes))


    return result
}

function getSliderVisuals(params: GetSliderVisualsParams) {
    const { mergedProps, switchSlide, curSlide } = params
    const { withControlls, theme, swipeDelta, slides } = mergedProps

    const slidesLength = slides.length

    const controlls = []
    if (withControlls) {
        for (let i = 0; i < slidesLength; i++) {
            controlls.push(
                <div key={ i } data-page={ i }
                    className={ `${theme.control} ${i == curSlide ? theme.control__active : ''}` } />
            )
        }
    }


    let prevSlideIndex = curSlide - 1
    prevSlideIndex < 0 && (prevSlideIndex = slidesLength - 1)

    let nextSlideIndex = curSlide + 1
    nextSlideIndex >= slidesLength && (nextSlideIndex = 0)

    const slidePages = [
        <div key={ `${prevSlideIndex} p` } className={ `${theme.slide} ${theme.slide__prev}` }
            children={ slides[prevSlideIndex] } />,

        <div key={ curSlide } className={ `${theme.slide} ${theme.slide__active}` }
            children={ slides[curSlide] } />,

        <div key={ `${nextSlideIndex} n` } className={ `${theme.slide} ${theme.slide__next}` }
            children={ slides[ nextSlideIndex ] } />
    ]


    return {
        pageControlls: withControlls && (
            <div className={ theme.controls_wrapper } children={ controlls }
                onMouseDown={ e => {
                    const nextSlide = (e.target as HTMLDivElement).dataset.page
                    if (nextSlide) {
                        const nextSlideInt = +nextSlide
                        switchSlide(nextSlideInt, nextSlideInt > curSlide, true)
                    }
                } } />
        ),

        slidePages: (
            <Swipe children={ slidePages } className={ theme.slides_wrapper } xAxis
                deltaPos={ swipeDelta }
                onSwipe={ isSlideNext => {
                    switchSlide(
                        isSlideNext ? curSlide + 1 : curSlide - 1,
                        isSlideNext
                    )
                } } />
        )
    }
}

const Slider: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Slider.defaults, props, false)
        :   (props as MergedProps)

    const { innerStore, theme, autoslideInterval, loop, withControlls } = mergedProps

    const [ curSlide, setSlide ] = innerStore || useState(0)
    const slideDirectionState = useState({
        isLastDirectionForward: undefined as boolean | undefined
    })[0]
    const { isLastDirectionForward } = slideDirectionState

    const sliderRootProps = getSliderRootProps(mergedProps)

    if (isExists(isLastDirectionForward)) {
        sliderRootProps.className += ` ${isLastDirectionForward ? theme.__slided_forward : theme.__slided_backward}`
    }


    useLayoutEffect(() => {
        const rootElement = sliderRootProps.ref.current as HTMLDivElement
        rootElement.style.setProperty(
            '--slide_width',
            (
                rootElement
                    .childNodes[ withControlls ? 1 : 0 ]
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

        const lastIndex = mergedProps.slides.length - 1
        const nextSlide = isControlClick
            ?   _nextSlide
            :   _nextSlide > lastIndex
                ?   loop ? 0 : lastIndex
                :   _nextSlide < 0
                    ?   loop ? lastIndex : 0
                    :   _nextSlide


        setSlide(nextSlide)
    }


    const { pageControlls, slidePages } = getSliderVisuals({ mergedProps, switchSlide, curSlide })


    return (
        <div { ...sliderRootProps }>
            { pageControlls }
            { slidePages }

            { addChildren(sliderRootProps, mergedProps.theme) }
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
        __slided_forward: '',
        __slided_backward: ''
    },

    swipeDelta: 30
}
Slider.ID = componentID


export { componentID }
export default Slider
export type { Props }