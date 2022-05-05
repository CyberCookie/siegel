import React, { useState } from 'react'

import Swipe, { Props } from 'siegel-ui/Swipe'

import theme from './styles.sass'


const { ID } = Swipe

const Demo = () => {
    const [ swiped, setSwiped ] = useState(false)

    let className = theme.swipe_block
    swiped && (className += ` ${theme.swiped}`)

    const props: Props = {
        className,
        children: <div children='swipe me' />,
        onSwipe(swiped) { setSwiped(!swiped) }
    }

    const horizaontalSwuipeClassName = `${className} ${theme.horizontal}`


    return <>
        <h2 children='simple (swipe up / down)' />
        <Swipe { ...props } />

        <h2 children='xAxis. delta 30. (swipe left / right)' />
        <Swipe { ...props } className={ horizaontalSwuipeClassName } deltaPos={ 30 } xAxis />
    </>
}
Demo.id = ID


export default Demo