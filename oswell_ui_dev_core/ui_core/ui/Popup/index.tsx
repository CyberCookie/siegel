import React from 'react'

import { setDefaultProps, extractProps } from '../ui_utils'
import { Props, DefaultProps } from './types'
import s from './styles.sass'


const componentID = '-ui-popup'
const defaults: DefaultProps = {
    theme: {
        popup: componentID,
        content: componentID + '_content',
        close: componentID + '_close'
    },

    closeIcon: 'X'
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}

const onPopupBodyClick = (e: React.MouseEvent) => e.stopPropagation();

const Popup = (props: Props) => {
    let { theme, className = '', closeIcon, content, onClose } = extractProps(defaults, props)

    className += ` ${s.popup} ${theme.popup}` ;


    return (
        <div className={className} onMouseDown={onClose}>
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