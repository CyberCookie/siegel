import React from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'

import type { DivTagAttributes } from '../_internals/types'
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
            theme, closeIcon, content, rootTagAttributes, className,
            onClose, onMouseDown
        } = props

        let popupRootAttributes: DivTagAttributes = {
            className,
            onMouseDown(e) {
                onMouseDown?.(e)
                if (!e.defaultPrevented && e.target === e.currentTarget) {
                    onClose(e)
                }
            }
        }
        applyRefApi(popupRootAttributes, props)
        popupRootAttributes = resolveTagAttributes(popupRootAttributes, rootTagAttributes)

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