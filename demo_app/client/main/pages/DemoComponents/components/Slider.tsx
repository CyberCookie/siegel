import React, { useState } from 'react'

import { Slider, SliderProps } from 'app/components'


const { ID } = Slider

const slides = (new Array(4))
    .fill(0)
    .map((_, i) => <>slide {i + 1}</>)

const Demo = () => {
    const store = useState(1)

    const props: SliderProps = { slides }


    return <>
        <h1 children={ ID } />

        <h2 children='simple' />
        <Slider { ...props } />

        <h2 children={ `controlled. active slide: ${ store[0] }` } />
        <Slider { ...props } innerStore={ store } />

        <h2 children='with controls; loop' />
        <Slider { ...props } withControlls loop />
    </>
}
Demo.id = ID


export default Demo