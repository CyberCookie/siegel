//TODO?: visible slides count (???)


import React from 'react'

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
            controls.push(
                <div key={ i } data-page={ i }
                    className={ `${theme.control} ${i == curSlide ? theme.control__active : ''}` } />
            )
        }
    }


    let prevSlideIndex = curSlide - 1
    prevSlideIndex < 0 && (prevSlideIndex = slidesLength - 1)

    let nextSlideIndex = curSlide + 1
    nextSlideIndex >= slidesLength && (nextSlideIndex = 0)


    const prevSlideEl = getSideSlide(slides[prevSlideIndex])
    const nextSlideEl = getSideSlide(slides[nextSlideIndex])

    const curSlideEl = slides[curSlide] instanceof Function
        ?   (slides[curSlide] as SlideFn)(curSlide)
        :   slides[curSlide] as SlideEl


    const slidePages = [
        <div key={ `${prevSlideIndex}p` } className={ `${theme.slide} ${theme.slide__prev}` }
            children={ prevSlideEl } />,

        <div key={ curSlide } className={ `${theme.slide} ${theme.slide__active}` }
            children={ curSlideEl } />,

        <div key={ `${nextSlideIndex}n` } className={ `${theme.slide} ${theme.slide__next}` }
            children={ nextSlideEl } />
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