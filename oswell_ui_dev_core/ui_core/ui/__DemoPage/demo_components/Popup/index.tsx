import React, { useState } from 'react'

import Popup/*, { Props }*/ from '../../../Popup'
import { Props } from '../../../Popup/types'
import { icon } from '../../icons'

import s from './styles.sass'


const theme: Props['theme'] = {
    root: s.popup,
    close: s.close,
    content: s.content
}

const Demo = () => {
    const [ isActivePopup, setActivePopup ] = useState(false)

    const props: Props = {
        theme,
        className: s.popup,
        closeIcon: icon,
        content: 'this is popup content',
        onClose() {
            setActivePopup(false)
        }
    }


    return <>
        <h1>{Popup.ID}</h1>

        <h2 onMouseDown={() => { setActivePopup(true) }}>
            simple [click to trigger the popup]
        </h2>

        { isActivePopup && <Popup {...props} /> }
    </>
}
Demo.id = Popup.ID;


export default Demo