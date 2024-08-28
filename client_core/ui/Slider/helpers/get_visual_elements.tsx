//TODO: number of visible slides at the moment (now is 1)

import React from 'react'

import applyClassName from '../../_internals/apply_classname'
import Swipe from '../../Swipe'

import type {
    MergedProps, SwitchSlide,
    Slide, SlideFn, SlideEl
} from '../types'


type GetSliderVisualsParams = {
    props: MergedProps
    switchSlide: SwitchSlide
    curSlide: number
}


const getSideSlide = (slide: Slide) => (
    slide instanceof Function ? undefined : slide
)

function getVisualElements(params: GetSliderVisualsParams) {
    const {
        switchSlide, curSlide,
        props: { withControls, theme, swipeDelta, slides }
    } = params

    const slidesLength = slides.length

    const controls = []
    if (withControls) {
        for (let i = 0; i < slidesLength; i++) {
            const className = applyClassName(theme.control, [[ theme.control__active, i == curSlide ]])
            controls.push( <div key={ i } data-page={ i } className={ className } /> )
        }
    }


    let prevSlideIndex = curSlide - 1
    prevSlideIndex < 0 && (prevSlideIndex = slidesLength - 1)

    let nextSlideIndex = curSlide + 1
    nextSlideIndex >= slidesLength && (nextSlideIndex = 0)


    const slidePages = [
        <div key={ `${prevSlideIndex}p` }
            children={ getSideSlide(slides[prevSlideIndex]) }
            className={ applyClassName(theme.slide, [[ theme.slide__prev, true ]]) } />,

        <div key={ curSlide }
            children={
                slides[curSlide] instanceof Function
                ?   (slides[curSlide] as SlideFn)(curSlide)
                :   slides[curSlide] as SlideEl
            }
            className={ applyClassName(theme.slide, [[ theme.slide__active, true ]]) } />,

        <div key={ `${nextSlideIndex}n` }
            children={ getSideSlide(slides[nextSlideIndex]) }
            className={ applyClassName(theme.slide, [[ theme.slide__next, true ]]) } />
    ]


    return {
        pageControls: withControls && (
            <div className={ theme.controls_wrapper } children={ controls }
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


export default getVisualElements