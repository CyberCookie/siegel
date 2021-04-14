import React, { useState } from 'react'

import { Popup, PopupProps } from 'app/components'


const Demo = () => {
    const [ isActivePopup, setActivePopup ] = useState(false)

    const props: PopupProps = {
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