import React from 'react'

import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import type {
    Component, MergedProps,
    Props
} from './types'

import styles from './styles.sass'


const componentID = '-ui-popup'

const innerCloseClassName = styles[`${componentID}_close`]

const Popup: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Popup.defaults, props, false)
        :   (props as MergedProps)

    const { theme, closeIcon, content, onClose, attributes, className, refApi } = mergedProps

    let popupRootAttributes = {
        className,
        onMouseDown(e: React.MouseEvent) {
            e.target === e.currentTarget && onClose(e)
        }
    }
    refApi && (applyRefApi(popupRootAttributes, mergedProps))
    attributes && (popupRootAttributes = Object.assign(popupRootAttributes, attributes))


    return (
        <div { ...popupRootAttributes }>
            <div className={ theme.content }>
                <div onMouseDown={ onClose } className={ `${innerCloseClassName} ${theme.close}` }
                    children={ closeIcon } />

                { content }
            </div>
        </div>
    )
}
Popup.defaults = {
    className: styles[`${componentID}_inner`],
    theme: {
        root: '',
        content: '',
        close: ''
    },

    closeIcon: 'X'
}
Popup.ID = componentID


export { componentID }
export default Popup
export type { Props }