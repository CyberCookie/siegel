import React, { useState } from 'react'

import { Slider, SliderProps } from 'app/components'


const { ID } = Slider

const slides = (new Array(4))
    .fill(0)
    .map((_, i) => <>slide {i + 1}</>)

const Demo = () => {
    const storeForExample1 = useState(0)
    const storeForExample2 = useState(0)

    const props: SliderProps = { slides }


    return <>
        <h1 children={ ID } />

        <h2 children='simple' />
        <Slider { ...props } />

        <h2 children={ `controlled. active slide: ${ storeForExample1[0] }` } />
        <Slider { ...props } innerStore={ storeForExample1 } />

        <h2 children='with controls; loop; autoslide' />
        <Slider { ...props } withControlls loop autoslideInterval={ 2000 }
            innerStore={ storeForExample2 } />
    </>
}
Demo.id = ID


export default Demo