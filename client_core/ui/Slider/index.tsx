import React, { useState, useLayoutEffect } from 'react'

import isExists from '../../../common/is/exists'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import addChildren from '../_internals/children'
import { getRootProps, getVisualElements } from './helpers'

import type {
    Component, Props, DefaultProps,
    SwitchSlide, SlideEl, SlideFn
} from './types'


const _undef = undefined
const componentID = '-ui-slider'

const Slider: Component = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            children: _undef,
            slides_wrapper: _undef,
            slide: _undef,
            slide__active: _undef,
            slide__prev: _undef,
            slide__next: _undef,
            controls_wrapper: _undef,
            control: _undef,
            control__active: _undef,
            _slided_forward: _undef,
            _slided_backward: _undef
        },
        swipeDelta: 30
    },
    props => {

        const {
            store, theme, autoslideInterval, loop, withControls, children, slides
        } = props

        const [ curSlide, setSlide ] = store || useState(0)
        const slideDirectionState = useState({
            isLastDirectionForward: _undef as boolean | undefined
        })[0]
        const { isLastDirectionForward } = slideDirectionState

        const sliderRootProps = getRootProps(props)
        sliderRootProps.className = applyClassName(sliderRootProps.className, [
            [ isLastDirectionForward ? theme._slided_forward : theme._slided_backward, isExists(isLastDirectionForward) ]
        ])


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
export type { Component, Props, SlideEl, SlideFn }