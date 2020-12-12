import React from 'react'

import { extractProps } from '../ui_utils'
import type { _Popup } from './types'

import styles from './styles.sass'


const componentID = '-ui-popup'

const innerCloseClassName = componentID + '_close__inner'

const Popup: _Popup = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Popup.defaults, props)
        :   (props as _Popup['defaults'] & typeof props)

    const { theme, closeIcon, content, onClose, attributes, className } = mergedProps;

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
                <div onMouseDown={onClose} className={`${styles[innerCloseClassName]} ${theme.close}`}
                    children={closeIcon} />

                { content }
            </div>
        </div>
    )
}
Popup.defaults = {
    className: styles[componentID + '__inner'],
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