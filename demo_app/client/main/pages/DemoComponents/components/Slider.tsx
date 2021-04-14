import React, { useState } from 'react'

import { Slider, SliderProps } from 'app/components'


const slides = (new Array(4))
    .fill(0)
    .map((_, i) => <>slide {i + 1}</>)

const Demo = () => {
    const store = useState(1)
    
    const props: SliderProps = { slides }


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


export default Demo