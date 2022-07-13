import React from 'react'

import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'

import type { Component, Props } from './types'

import styles from './styles.sass'


const componentID = '-ui-popup'

const Popup: Component = component(
    componentID,
    {
        className: styles.root,
        theme: {
            root: '',
            content: '',
            close: ''
        },
        closeIcon: 'X'
    },
    props => {

        const {
            theme, closeIcon, content, onClose, rootTagAttributes, className, refApi
        } = props

        let popupRootAttributes = {
            className,
            onMouseDown(e: React.MouseEvent) {
                e.target === e.currentTarget && onClose(e)
            }
        }
        refApi && (applyRefApi(popupRootAttributes, props))
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
)


export default Popup
export { componentID }
export type { Component, Props }