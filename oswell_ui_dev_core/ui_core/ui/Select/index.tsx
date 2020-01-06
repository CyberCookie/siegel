import React, { useState, useEffect, useRef,
    ReactNode, ReactChild, Dispatch, SetStateAction } from 'react'

import isTouchScreen from '../../utils/is_touchscreen'

type onOptionSelectFn = (id: string, data?: any) => void

type SelectValue = {
    id: string,
    title: ReactNode
}

type selectOptions = {
    [id: string]: {
        disabled?: boolean,
        data?: any,
        title: ReactNode
    }
}

interface DefaultProps {
    theme: UITheme,
    closeOnSelect: boolean,
    dropdownIcon: ReactNode
}

interface Props {
    theme?: UITheme,
    className?: string,
    attributes?: React.Attributes,
    dropdownIcon?: ReactNode,
    closeOnSelect?: boolean,
    label?: ReactNode,
    onSelect: onOptionSelectFn,
    options: selectOptions[],
    value: SelectValue
}


const componentID = '-ui-select'

const defaults: DefaultProps = {
    theme: {
        select: componentID,
        label: componentID + '_label',
        title: componentID + '_title',
        select_active: componentID + '__active',
        options: componentID + '_options',
        option: componentID + '_option',
        option_active: componentID + '_option__active',
        option_disabled: componentID + '_option__disabled'
    },

    closeOnSelect: true,
    dropdownIcon: null
}

const setDefaults = (customDefaults: Props) => Object.assign(defaults, customDefaults)


const _isTouchScreen = isTouchScreen()

function getOptions(props: DefaultProps & Props, setActive: Dispatch<SetStateAction<boolean>>): ReactChild[] {
    let { options, value, theme, onSelect, closeOnSelect }: Props = props;

    let result = []
    
    for (let id in options) {
        let { disabled, data, title } = options[id]

        let optionClassName = theme.option;
        id === value.id && (optionClassName += ` ${theme.option_active}`)
        disabled && (optionClassName += ` ${theme.option_disabled}`)

        result.push(
            <div key={id} children={title} className={optionClassName}
                onMouseDown={e => {
                    e.stopPropagation()
                    onSelect(id, data)
                    closeOnSelect && setActive(false)
                }} />
        )
    }

    return result
}


const Select = (props: Props) => {    
    let theme = props.theme
        ?   Object.assign({}, defaults.theme, props.theme)
        :   defaults.theme;

    let mergedProps = Object.assign({}, defaults, props)
    let { className, attributes, value, dropdownIcon, label } = mergedProps


    let [ isActive, setActive ] = useState(false)
    let ref = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        let eventOptions = { passive: true }

        _isTouchScreen
            ?   document.addEventListener('touchstart', handleOutsideClick, eventOptions)
            :   document.addEventListener('mousedown', handleOutsideClick, eventOptions)
        
        return () => {
            _isTouchScreen
                ?   document.removeEventListener('touchstart', handleOutsideClick)
                :   document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])

    
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
        ref.current!.contains(e.target as Node) || setActive(false)
    }
    
    let wrapperClassName = theme.select;
    isActive && (wrapperClassName += ` ${theme.select_active}`)
    className && (wrapperClassName += ` ${className}`)
    
    let wrapperAttributes = Object.assign({}, attributes, {
        ref,
        className: wrapperClassName,
        onMouseDown(e: React.MouseEvent) {
            e.stopPropagation()
            e.preventDefault()
    
            setActive(!isActive)
        }
    })
    
    
    return (
        <div {...wrapperAttributes}>
            { label && <div className={theme.label} children={label} /> }

            <div className={theme.title}>
                { value.title }
                { dropdownIcon }
            </div>

            <div className={theme.options}>
                { getOptions(mergedProps, setActive) }
            </div>
        </div>
    )
}


export { setDefaults }
export default Select