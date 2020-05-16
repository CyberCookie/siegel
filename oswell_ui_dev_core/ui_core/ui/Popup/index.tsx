import React from 'react'

import { extractProps } from '../ui_utils'
import { _Popup } from './types'

import s from './styles.sass'


const componentID = '-ui-popup'

const Popup: _Popup = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Popup.defaults, props)
        :   (props as _Popup['defaults'] & typeof props)

    const { theme, closeIcon, content, onClose, attributes } = mergedProps;
    const className = `${mergedProps.className} ${s.popup}`

    let popupRootAttributes = {
        className,
        onMouseDown(e: React.MouseEvent) {
            e.target === e.currentTarget && onClose(e)
        }
    }
    attributes && (popupRootAttributes = Object.assign(popupRootAttributes, attributes))


    return (
        <div {...popupRootAttributes}>
            <div className={theme.content}>
                <div onMouseDown={onClose} className={`${s.close} ${theme.close}`}
                    children={closeIcon} />

                { content }
            </div>
        </div>
    )
}
Popup.defaults = {
    theme: {
        root: componentID,
        content: componentID + '_content',
        close: componentID + '_close'
    },

    closeIcon: 'X'
}
Popup.ID = componentID;


export { componentID }
export default Popup