//TODO: loop visual
//TODO: autoslide

import React, { useState, useEffect, useRef } from 'react'

import isE from '../../utils/is_exists'
import { extractProps, applyRefApi } from '../ui_utils'
import addChildren from '../children'
import Swipe from '../Swipe'
import type {
    Component, MergedProps, SwitchSlide,
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

function getSliderVisuals(mergedProps: MergedProps, switchSlide: SwitchSlide, curSlide: number) {
    const { withControlls, theme, swipeDelta, slides, loop } = mergedProps

    const controlls = []
    const slidePages = []
    const slidesLength = slides.length

    function onSlideSwipe(isNext: boolean) {
        let nextPage, next
        if (isNext) {
            next = curSlide + 1
            nextPage = next < slidesLength
                ?   next
                :   loop ? 0 : undefined
        } else {
            next = curSlide - 1
            nextPage = next >= 0
                ?   next
                :   loop ? slidesLength - 1 : undefined
        }

        isE(nextPage) && switchSlide(nextPage)
    }


    for (let i = 0; i < slidesLength; i++) {
        withControlls && controlls.push(
            <div key={i} className={`${theme.control} ${i == curSlide ? theme.control__active : ''}`}
                data-page={i} />
        )

        let className = theme.slide
        i == curSlide && (className += ` ${theme.slide__active}`)

        slidePages.push( <div className={className} key={i} children={slides[i]} /> )
    }


    return {
        pageControlls: withControlls && (
            <div className={theme.controls_wrapper} children={controlls} onMouseDown={e => {
                const nextPage = (e.target as HTMLDivElement).dataset.page
                nextPage && switchSlide(+nextPage)
            }} />
        ),

        slidePages: (
            <Swipe children={slidePages} className={theme.slides_wrapper} xAxis
                deltaPos={swipeDelta}
                onSwipe={onSlideSwipe} />
        )
    }
}

function getSlideElements(rootChilds: NodeListOf<ChildNode>, withControlls: MergedProps['withControlls']) {
    const slideArea = ((withControlls ? rootChilds[1] : rootChilds[0]) as HTMLElement)
    const firstSlidePage = (slideArea.childNodes[0] as HTMLElement)

    return { slideArea, firstSlidePage }
}

const Slider: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Slider.defaults, props, false)
        :   (props as MergedProps)

    const { withControlls, innerStore } = mergedProps

    const [ curSlide, setSlide ] = innerStore || useState(0)


    const sliderRootProps = getSliderRootProps(mergedProps)

    useEffect(() => {
        // Hack since React triggers useEffect before childs mount
        curSlide && setTimeout(() => { switchSlide(curSlide) })
    }, [])


    const switchSlide: SwitchSlide = nextPage => {
        const { slideArea, firstSlidePage } = getSlideElements(sliderRootProps.ref.current.childNodes, withControlls)
        const offset = (nextPage * -firstSlidePage.offsetWidth) + 'px'

        slideArea.style.setProperty('--offset_left', offset)
        slideArea.style.marginLeft = offset

        setSlide(nextPage)
    }


    const { pageControlls, slidePages } = getSliderVisuals(mergedProps, switchSlide, curSlide)


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
        controls_wrapper: '',
        control: '',
        control__active: '',
    },

    swipeDelta: 30
}
Slider.ID = componentID


export { componentID }
export default Slider
export type { Props }