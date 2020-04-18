import React, { useState, useEffect, useRef } from 'react'

import { extractProps } from '../ui_utils'
import Swipe, { HTMLSwipeMouseEvent } from '../Swipe'
import { SliderElementsResult, _Slider } from './types'

import './styles'


const componentID = '-ui-slider'

const Slider: _Slider = (props, withDefaults) => {
    const mergedProps = withDefaults
        ?   (props as _Slider['defaults'] & typeof props)
        :   extractProps(Slider.defaults, props)
    
    const { className, theme, startFrom, showNumber, data, noControlls, attributes, onChange, swipeDelta } = mergedProps;

    let sliderRootProps = {
        className,
        ref: (useRef() as React.MutableRefObject<HTMLDivElement>)
    }
    attributes && (sliderRootProps = Object.assign(sliderRootProps, attributes))

    const [ curPage, setPage ] = useState(0)

    useEffect(() => {
        if (startFrom !== undefined) {
            // Hack since React triggers useEffect before childs mount
            const switchIntervalID = setInterval(() => {
                const firstSlidePage = getSlideElements().firstSlidePage;
    
                if (firstSlidePage) {
                    clearInterval(switchIntervalID)
                    switchPage(startFrom)
                }
            }, 100)
        }
    }, [])


    const numberOfPages = Math.ceil(data.length / showNumber)

    function getSlideElements() {
        const wrapperChilds = sliderRootProps.ref.current.childNodes;
        const slideArea = ((noControlls ? wrapperChilds[0] : wrapperChilds[1]) as HTMLElement)
        const firstSlidePage = (slideArea.childNodes[0] as HTMLElement)

        return { slideArea, firstSlidePage }
    }

    function onSlideSwipe(isNext: boolean, e: HTMLSwipeMouseEvent) {
        if (isNext) {
            (curPage < (numberOfPages - 1)) && switchPage(curPage + 1, e)
        } else if (curPage) {
            switchPage(curPage - 1, e)
        }
    }

    function switchPage(nextPage: number, e?: HTMLSwipeMouseEvent | React.MouseEvent) {
        setPage(nextPage)

        const { slideArea, firstSlidePage } = getSlideElements()

        let nextLeft = firstSlidePage.clientWidth;
        const slidePageStyles: Indexable = window.getComputedStyle(firstSlidePage)
        slidePageStyles['margin-left'] && (nextLeft += parseInt(slidePageStyles['margin-left']))
        slidePageStyles['margin-right'] && (nextLeft += parseInt(slidePageStyles['margin-right']))
        slidePageStyles['border-left-width'] && (nextLeft += parseInt(slidePageStyles['border-left-width']))
        slidePageStyles['border-right-width'] && (nextLeft += parseInt(slidePageStyles['border-right-width']))

        slideArea.style.left = (nextPage * -nextLeft) + 'px'

        onChange && onChange(nextPage, e)
    }
    
    function getSliderElements() {
        const controlls = []
        const slidePages = []

        for (let i = 0, curSlideIndex = 0; i < numberOfPages; i++) {
            const slides = []

            noControlls || controlls.push(
                <div key={i} className={`${theme.control} ${i == curPage ? theme.control__active : ''}`}
                    data-page={i} />
            )

            for (let j = 0; j < showNumber && curSlideIndex < data.length; j++, curSlideIndex++) {
                slides.push(
                    <div key={j} className={theme.slide} children={data[curSlideIndex]} />
                )
            }

            slidePages.push(
                <div className={theme.slide_page} key={i} children={slides} />
            )
        }
        
        const result: SliderElementsResult = { slidePages }
        noControlls || (result.pageControlls = (
            <div className={theme.slides_controlls} children={controlls} onMouseDown={e => {
                const nextPage = (e.target as HTMLDivElement).dataset.page;
                nextPage && switchPage(+nextPage, e)
            }} />
        ))


        return result
    }

    const { pageControlls, slidePages } = getSliderElements()


    return (
        <div {...sliderRootProps}>
            { noControlls || pageControlls }

            <Swipe children={slidePages} className={theme.slides} xAxis
                deltaPos={swipeDelta}
                onSwipe={onSlideSwipe} />
        </div>
    )
}
Slider.defaults = {
    theme: {
        root: componentID,
        slides: componentID + '_slides',
        slide_page: componentID + '_slide_page',
        slides_controls: componentID + '_slides_controls',
        control: componentID + '_control',
        control__active: componentID + '__active',
        slide: componentID + '_slide'
    },

    showNumber: 1,
    swipeDelta: 30
}
Slider.ID = componentID;


export * from './types'
export { componentID }
export default Slider