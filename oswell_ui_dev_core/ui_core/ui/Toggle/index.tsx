import React,
    { ReactNode } from 'react'

import './styles'

interface Props {
    theme?: UITheme,
    className?: string,
    labelLeft?: React.ComponentType<any>,
    labelRight?: ReactNode,
    toggleIcon?: ReactNode,
    isToggled?: boolean,
    onToggle?: (e: React.MouseEvent) => void,
}

interface defaultProps {
    theme: UITheme
}


const componentID = '-ui-toggle'

const defaults: defaultProps = {
    theme: {
        toggle: componentID,
        toggle_checked: componentID + '__checked',
        label: componentID + '_label',
        toggle_area: componentID + '_toggle_area',
        toggler: componentID + '_toggler'
    }
}

const setDefaults = (customDefaults: Props) => Object.assign(defaults, customDefaults)


const Toggle = (props: Props) => {
    let theme = props.theme
        ?   Object.assign({}, defaults.theme, props.theme)
        :   defaults.theme;

    let { labelLeft, labelRight, isToggled, onToggle, className, toggleIcon } = Object.assign({}, defaults, props)


    let wrapperClassName = theme.toggle;
    isToggled && (wrapperClassName += ` ${theme.toggle_checked}`)
    className && (wrapperClassName += ` ${className}`)


    return (
        <div className={wrapperClassName} onMouseDown={onToggle}>
            { labelLeft && <div className={theme.label} children={labelLeft} /> }

            <div className={theme.toggle_area}>
                <div className={theme.toggler} children={toggleIcon} />
            </div>

            { labelRight && <div className={theme.label} children={labelRight} /> }
        </div>
    )
}


export { setDefaults }
export default Toggle