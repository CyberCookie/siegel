import React, { useState, useEffect, useRef, HTMLAttributes, Attributes, RefAttributes, MutableRefObject } from 'react'

import Swipe from 'core-ui/Swipe'
import './styles'

type SliderElementsResult = {
    slidePages: JSX.Element[],
    pageControlls?: JSX.Element
}

interface Props {
    theme?: UITheme,
    className?: string,
    startFrom?: number,
    noControlls?: boolean,
    showNumber?: number,
    attributes?: React.Attributes,
    onSlide?: (nextPage: number) => void,
    data: React.ReactNode[]
}

interface DefaultProps {
    theme: UITheme,
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

const setDefaults = (customDefaults: Props) => Object.assign(defaults, customDefaults)

const Slider = (props: Props) => {
    let theme = props.theme
        ?   Object.assign({}, defaults.theme, props.theme)
        :   defaults.theme;

    let { className, startFrom, showNumber, data, noControlls, attributes, onSlide } = Object.assign({}, defaults, props)


    let _className = `${theme.slider} `
    className && (_className += className)

    let wrapperProps: RefAttributes<HTMLDivElement> = Object.assign({}, attributes, {
        className,
        ref: useRef<HTMLDivElement>()
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
        let wrapperChilds = (wrapperProps.ref as MutableRefObject<HTMLDivElement>).current.childNodes;
        let slideArea = noControlls ? (wrapperChilds[0] as HTMLElement) : (wrapperChilds[1] as HTMLElement)
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
        let slidePageStyles: IndexingObject = window.getComputedStyle(firstSlidePage)
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