import React, { useState, useLayoutEffect } from 'react'

import isExists from '../../../common/is/exists'
import component from '../_internals/component'
import addChildren from '../_internals/children'
import { getRootProps, getVisualElements } from './helpers'

import type { Component, Props, SwitchSlide } from './types'


const componentID = '-ui-slider'

const Slider: Component = component(
    componentID,
    {
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
    },
    props => {

        const {
            store, theme, autoslideInterval, loop, withControls, children, slides
        } = props

        const [ curSlide, setSlide ] = store || useState(0)
        const slideDirectionState = useState({
            isLastDirectionForward: undefined as boolean | undefined
        })[0]
        const { isLastDirectionForward } = slideDirectionState

        const sliderRootProps = getRootProps(props)

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


        const { pageControls, slidePages } = getVisualElements({ props, switchSlide, curSlide })


        return (
            <div { ...sliderRootProps }>
                { pageControls }
                { slidePages }

                { children && addChildren(children, theme) }
            </div>
        )
    }
)


export default Slider
export { componentID }
export type { Component, Props }