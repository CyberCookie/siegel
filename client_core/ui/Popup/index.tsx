import React from 'react'

import mergeTagAttributes from '../_internals/merge_tag_attributes'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import type { Component, Props, MergedProps } from './types'

import styles from './styles.sass'


const componentID = '-ui-popup'

const Popup: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Popup.defaults, props, false)
        :   (props as MergedProps)

    const { theme, closeIcon, content, onClose, rootTagAttributes, className, refApi } = mergedProps

    let popupRootAttributes = {
        className,
        onMouseDown(e: React.MouseEvent) {
            e.target === e.currentTarget && onClose(e)
        }
    }
    refApi && (applyRefApi(popupRootAttributes, mergedProps))
    rootTagAttributes && (popupRootAttributes = mergeTagAttributes(popupRootAttributes, rootTagAttributes))


    return (
        <div { ...popupRootAttributes }>
            <div className={ theme.content }>
                <div onMouseDown={ onClose } className={ `${styles.close} ${theme.close}` }
                    children={ closeIcon } />

                { content }
            </div>
        </div>
    )
}
Popup.defaults = {
    className: styles.root,
    theme: {
        root: '',
        content: '',
        close: ''
    },

    closeIcon: 'X'
}
Popup.ID = componentID


export default Popup
export { componentID }
export type { Component, Props } 