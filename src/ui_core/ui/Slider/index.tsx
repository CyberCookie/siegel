//TODO: loop visual
//TODO: autoslide

import React, { useState, useEffect, useRef } from 'react'

import isE from '../../utils/is_exists'
import { extractProps } from '../ui_utils'
import Swipe from '../Swipe'
import type { _Slider, Props, DefaultProps } from './types'

import './styles'


type MergedProps = Props & DefaultProps
type SwitchSlide = (nextPage: number) => void


const componentID = '-ui-slider'

function getSliderRootProps(mergedProps: MergedProps) {
    const { className, attributes } = mergedProps;
    let result = {
        className,
        ref: (useRef() as React.MutableRefObject<HTMLDivElement>)
    }
    attributes && (result = Object.assign(result, attributes))


    return result
}

function getSliderVisuals(mergedProps: MergedProps, switchSlide: SwitchSlide, curSlide: number) {
    const { withControlls, theme, swipeDelta, slides, loop } = mergedProps;

    const controlls = []
    const slidePages = []
    const slidesLength = slides.length;
    
    function onSlideSwipe(isNext: boolean) {
        let nextPage, next;
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
        
        let className = theme.slide;
        i == curSlide && (className += ` ${theme.slide__active}`)

        slidePages.push( <div className={className} key={i} children={slides[i]} /> )
    }
    

    return {
        pageControlls: withControlls && (
            <div className={theme.controls_wrapper} children={controlls} onMouseDown={e => {
                const nextPage = (e.target as HTMLDivElement).dataset.page;
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

const Slider: _Slider = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Slider.defaults, props)
        :   (props as _Slider['defaults'] & typeof props)
    
    const { withControlls, store } = mergedProps;

    const [ curSlide, setSlide ] = store || useState(0)


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
        <div {...sliderRootProps}>
            { pageControlls }
            { slidePages }
        </div>
    )
}
Slider.defaults = {
    theme: {
        root: componentID,
        slides_wrapper: componentID + '_slides_wrapper',
        slide: componentID + '_slide',
        slide__active: componentID + '_slide__active',
        controls_wrapper: componentID + '_controls_wrapper',
        control: componentID + '_control',
        control__active: componentID + '__active',
    },

    swipeDelta: 30
}
Slider.ID = componentID;


export { componentID }
export default Slider