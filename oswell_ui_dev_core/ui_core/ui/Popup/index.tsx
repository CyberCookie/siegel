import React from 'react'

import { extractProps } from '../ui_utils'
import { _Popup } from './types'

import s from './styles.sass'


const componentID = '-ui-popup'

const onPopupBodyClick = (e: React.MouseEvent) => e.stopPropagation()

const Popup: _Popup = (props, withDefaults) => {
    const mergedProps = withDefaults
        ?   (props as _Popup['defaults'] & typeof props)
        :   extractProps(Popup.defaults, props)

    const { theme, closeIcon, content, onClose, attributes } = mergedProps;
    const className = `${mergedProps.className} ${s.popup} ${theme.popup}`

    let popupRootAttributes = {
        className,
        onMouseDown: onClose
    }
    attributes && (popupRootAttributes = Object.assign(popupRootAttributes, attributes))


    return (
        <div {...popupRootAttributes}>
            <div className={theme.content} onMouseDown={onPopupBodyClick}>
                <div onMouseDown={onClose} className={`${s.close} ${theme.close}`}
                    children={closeIcon} />

                { content }
            </div>
        </div>
    )
}
Popup.defaults = {
    theme: {
        popup: componentID,
        content: componentID + '_content',
        close: componentID + '_close'
    },

    closeIcon: 'X'
}
Popup.ID = componentID;


export { componentID }
export default Popup