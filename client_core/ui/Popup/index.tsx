import React from 'react'

import { extractProps, applyRefApi } from '../ui_utils'
import type { _Popup, Props } from './types'

import styles from './styles.sass'


const componentID = '-ui-popup'

const innerCloseClassName = componentID + '_close__inner'

const Popup: _Popup = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Popup.defaults, props, false)
        :   (props as _Popup['defaults'] & Props)

    const { theme, closeIcon, content, onClose, attributes, className, refApi } = mergedProps;

    let popupRootAttributes = {
        className,
        onMouseDown(e: React.MouseEvent) {
            e.target === e.currentTarget && onClose(e)
        }
    }
    refApi && (applyRefApi(popupRootAttributes, mergedProps))
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