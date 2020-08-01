import React, { useState } from 'react'

import Swipe from '../../../../ui/Swipe'
import { Props } from '../../../../ui/Swipe/types'

import s from './styles.sass'


const Demo = () => {
    const [ swiped, setSwiped ] = useState(false)

    let className = s.swipe_block;
    swiped && (className += ` ${s.swiped}`)

    const props: Props = {
        className,
        children: <div children='swipe me' />,
        onSwipe(swiped) { setSwiped(swiped) }
    }

    const horizaontalSwuipeClassName = `${className} ${s.horizontal}`

    
    return <>
        <h1>{Swipe.ID}</h1>

        <h2>simple (swipe up / down)</h2>
        <Swipe {...props} />

        <h2>xAxis. delta 30. (swipe left / right)</h2>
        <Swipe {...props} className={horizaontalSwuipeClassName} deltaPos={30} xAxis />
    </>
}
Demo.id = Swipe.ID;


export default Demo