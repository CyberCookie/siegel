import React, { useState } from 'react'

import { Slider, SliderProps } from 'app/components'


const slides = (new Array(4))
    .fill(0)
    .map((_, i) => () => `slide ${i + 1}`)

const Demo = () => {
    const storeForExample1 = useState(0)
    const storeForExample2 = useState(0)

    const props: SliderProps = { slides }


    return <>
        <h2 children='simple' />
        <Slider { ...props } />

        <h2 children={ `controled. active slide: ${ storeForExample1[0] }` } />
        <Slider { ...props } store={ storeForExample1 } />

        <h2 children='with controls; loop; autoslide' />
        <Slider { ...props } withControls loop
            autoslideInterval={ 2000 }
            store={ storeForExample2 } />
    </>
}
Demo.coreSrcDirName = 'Slider'


export default Demo