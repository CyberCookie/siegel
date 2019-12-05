import React, { useState, useLayoutEffect,
    ReactNode, MouseEventHandler, MouseEvent } from 'react'

import './styles'

interface Props {
    theme: UITheme,
    closeIcon: ReactNode
}

interface DefaultProps {
    theme: UITheme,
    closeIcon: ReactNode
}

type PopupState = {
    visibility: boolean,
    content: ReactNode,
    className: string
}

type PopupTrigger = ((content: ReactNode, className: string) => void | undefined)


const componentID = '-ui-popup'
const defaults: DefaultProps = {
    theme: {
        popup: componentID,
        content: componentID + '_content',
        close: componentID + '_close'
    },

    closeIcon: 'X'
}


let triggerPopup: PopupTrigger;
const initialState: PopupState = {
    visibility: false,
    content: null,
    className: ''
}

const bodyClassList = document.body.classList;

const onPopupBodyClick: MouseEventHandler = (e: MouseEvent) => e.stopPropagation();

const Popup = (props: Props) => {
    let theme = props.theme
        ?   Object.assign({}, defaults.theme, props.theme)
        :   defaults.theme;

    let closeIcon = props.closeIcon || defaults.closeIcon;

    let [ state, setState ] = useState(initialState)

    useLayoutEffect(() => {
        triggerPopup = (content: ReactNode, className: string) => {
            let nextState;
            if (content) {
                bodyClassList.add('popup-active')
                nextState = {
                    content, className,
                    visibility: true
                }
            } else {
                bodyClassList.remove('popup-active')
                nextState = initialState
            }

            setState(nextState)
        }
    }, [])


    function onClose() {
        bodyClassList.remove('popup-active')
        setState(initialState)
    }
    
    let wrapperClassName = theme.popup;
    state.className && (wrapperClassName += ` ${state.className}`)


    return state.visibility && state.content && (
        <div className={wrapperClassName} onMouseDown={onClose}>
            <div className={theme.content} onMouseDown={onPopupBodyClick}>
                { closeIcon && (
                    <div onMouseDown={onClose} className={theme.close}
                        children={closeIcon} />
                )}

                { state.content }
            </div>
        </div>
    )
}


export { triggerPopup }
export default Popup