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
        <h2 children='simple [click to trigger the popup]'
            onMouseDown={ () => { setActivePopup(true) } } />

        { isActivePopup && <Popup { ...props } /> }
    </>
}
Demo.coreSrcDirName = 'Popup'


export default Demo