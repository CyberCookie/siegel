import React, { useState } from 'react'

import Swipe from 'core-ui/Swipe'
import { Props } from 'core-ui/Swipe/types'

import theme from './styles.sass'


const Demo = () => {
    const [ swiped, setSwiped ] = useState(false)

    let className = theme.swipe_block;
    swiped && (className += ` ${theme.swiped}`)

    const props: Props = {
        className,
        children: <div children='swipe me' />,
        onSwipe(swiped) { setSwiped(!swiped) }
    }

    const horizaontalSwuipeClassName = `${className} ${theme.horizontal}`

    
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