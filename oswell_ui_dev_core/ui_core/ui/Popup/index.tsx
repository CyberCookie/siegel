import React from 'react'

import s from './styles'


const componentID = '-ui-popup'
const defaults = {
    theme: {
        popup: componentID,
        content: componentID + '_content',
        close: componentID + '_close'
    },

    closeIcon: 'X'
}

const setDefaults = customDefaults => Object.assign(defaults, customDefaults)

const onPopupBodyClick = e => e.stopPropagation();

const Popup = props => {
    let theme = props.theme
        ?   Object.assign({}, defaults.theme, props.theme)
        :   defaults.theme;

    let { className, closeIcon, content, onClose } = Object.assign({}, defaults, props)

    let wrapperClassName = `${s.popup} ${theme.popup}` ;
    className && (wrapperClassName += ` ${className}`)


    return (
        <div className={wrapperClassName} onMouseDown={onClose}>
            <div className={theme.content} onMouseDown={onPopupBodyClick}>
                <div onMouseDown={onClose} className={`${s.close} ${theme.close}`}
                    children={closeIcon} />

                { content }
            </div>
        </div>
    )
}


export { setDefaults }
export default Popup