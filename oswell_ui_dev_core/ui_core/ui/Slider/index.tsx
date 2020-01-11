import React, { useState, useEffect, useRef } from 'react'

import { setDefaultProps, extractProps, PropsComponentThemed } from '../ui_utils'
import Swipe from '../Swipe'
import './styles'

type SliderElementsResult = {
    slidePages: React.ReactNode[],
    pageControlls?: React.ReactNode
}

type Props = {
    startFrom?: number,
    noControlls?: boolean,
    showNumber?: number,
    attributes?: React.Attributes,
    onSlide?: (nextPage: number) => void,
    data: React.ReactNode[]
} & PropsComponentThemed

type DefaultProps = {
    theme: NonNullable<PropsComponentThemed['theme']>,
    showNumber: number
}


const componentID = '-ui-slider'

const defaults: DefaultProps = {
    theme: {
        slider: componentID,
        slides: componentID + '_slides',
        slide_page: componentID + '_slide_page',
        slides_controls: componentID + '_slides_controls',
        control: componentID + '_control',
        control__active: componentID + '__active',
        slide: componentID + '_slide'
    },

    showNumber: 1
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}

const Slider = (props: Props) => {
    let { theme, className = '', startFrom, showNumber, data, noControlls, attributes, onSlide } = extractProps(defaults, props)

    className += ` ${theme.slider}`;
    let wrapperProps = Object.assign({}, attributes, {
        className,
        ref: (useRef() as React.MutableRefObject<HTMLDivElement>)
    })

    let [ curPage, setPage ] = useState(0)

    useEffect(() => {
        if (startFrom !== undefined) {
            // Hack since React triggers useEffect before childs mount
            function switchInterval() {
                let firstSlidePage = getSlideElements().firstSlidePage;
    
                if (firstSlidePage) {
                    clearInterval(switchIntervalID)
                    switchPage(startFrom!)
                }
            }

            let switchIntervalID = setInterval(switchInterval, 100)
        }
    }, [])


    let numberOfPages = Math.ceil(data.length / showNumber)

    function getSlideElements() {
        let wrapperChilds = wrapperProps.ref.current.childNodes;
        let slideArea = ((noControlls ? wrapperChilds[0] : wrapperChilds[1]) as HTMLElement)
        let firstSlidePage = (slideArea.childNodes[0] as HTMLElement)

        return { slideArea, firstSlidePage }
    }

    function onSlideSwipe(isNext: boolean) {
        if (isNext) {
            (curPage < (numberOfPages - 1)) && switchPage(curPage + 1)
        } else if (curPage) {
            switchPage(curPage - 1)
        }
    }

    function switchPage(nextPage: number) {
        setPage(nextPage)

        let { slideArea, firstSlidePage } = getSlideElements()

        let nextLeft = firstSlidePage.clientWidth;
        let slidePageStyles: Indexable = window.getComputedStyle(firstSlidePage)
        slidePageStyles['margin-left'] && (nextLeft += parseInt(slidePageStyles['margin-left']))
        slidePageStyles['margin-right'] && (nextLeft += parseInt(slidePageStyles['margin-right']))
        slidePageStyles['border-left-width'] && (nextLeft += parseInt(slidePageStyles['border-left-width']))
        slidePageStyles['border-right-width'] && (nextLeft += parseInt(slidePageStyles['border-right-width']))

        slideArea.style.left = (nextPage * -nextLeft) + 'px'

        onSlide && onSlide(nextPage)
    }
    
    function getSliderElements() {
        let controlls = []
        let slidePages = []

        for (let i = 0, curSlideIndex = 0; i < numberOfPages; i++) {
            let slides = []

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
        
        let result: SliderElementsResult = { slidePages }
        noControlls || (result.pageControlls = (
            <div className={theme.slides_controlls} children={controlls} onMouseDown={e => {
                let nextPage = (e.target as HTMLDivElement).dataset.page;
                nextPage && switchPage(+nextPage)
            }} />
        ))


        return result
    }

    let { pageControlls, slidePages } = getSliderElements()


    return (
        <div {...wrapperProps}>
            { noControlls || pageControlls }

            <Swipe children={slidePages} className={theme.slides} xAxis
                deltaPos={30}
                onSwipe={onSlideSwipe} />
        </div>
    )
}


export { setDefaults }
export default Slider