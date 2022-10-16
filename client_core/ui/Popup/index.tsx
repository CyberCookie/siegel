import React from 'react'

import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'

import type { Component, Props, DefaultProps } from './types'

import styles from './styles.sass'


const _undef = undefined
const componentID = '-ui-popup'

const Popup = component<Props, DefaultProps>(
    componentID,
    {
        className: styles.root!,
        theme: {
            root: _undef,
            content: _undef,
            close: _undef
        }
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

        let closeElemClassName = styles.close
        theme.close && (closeElemClassName += ` ${theme.close}`)


        return (
            <div { ...popupRootAttributes }>
                <div className={ theme.content }>
                    <div onMouseDown={ onClose } className={ closeElemClassName }
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