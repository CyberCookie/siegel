import React, { useState } from 'react'

import Slider from 'essence-ui/Slider'
import { Props } from 'essence-ui/Slider/types'

import s from './styles.sass'


const theme = {
    root: s.slider,
    slides_wrapper: s.slides_wrapper,
    slide: s.slide,
    controls_wrapper: s.controls_wrapper,
    control: s.control,
    control__active: s.control__active
}

const slides = (new Array(4))
    .fill(0)
    .map((_, i) => <>slide {i + 1}</>)

const Demo = () => {
    const store = useState(1)
    
    const props: Props = { slides, theme }


    return <>
        <h1>{Slider.ID}</h1>

        <h2>simple</h2>
        <Slider {...props} />

        <h2>controlled. active slide: { store[0] }</h2>
        <Slider {...props} store={store} />

        <h2>with controls; loop</h2>
        <Slider {...props} withControlls loop />
    </>
}
Demo.id = Slider.ID;


export { theme }
export default Demo