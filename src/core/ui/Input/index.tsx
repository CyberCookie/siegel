import React, { useRef, useEffect,
    ReactNode, InputHTMLAttributes, RefAttributes, MutableRefObject } from 'react'

interface CurrentWrapperAttributes extends React.HTMLAttributes<HTMLDivElement> {
    error: string | null,
    filled: string | null
}

interface Props {
    theme?: UITheme,
    className?: string,
    wrapperAttr?: React.HTMLAttributes<HTMLDivElement>,
    inputAttr?: React.HTMLAttributes<HTMLInputElement>,
    label?: ReactNode,
    placeholder?: string,
    value?: string,
    errorMsg?: ReactNode,
    type?: string,
    disabled?: boolean,
    autofocus?: boolean,
    onBlur?: () => any,
    onChange?: (value: string, e: React.FormEvent) => any,
    onFocus?: () => void
}

interface DefaultProps {
    theme: UITheme,
    wrapperAttr: React.HTMLAttributes<HTMLDivElement>
}


const componentID = '-ui-input'

const defaults: DefaultProps = {
    theme: {
        input: componentID,
        field: componentID + '_field',
        textarea: componentID + '_textarea',
        extra: componentID + '_extra',
        error_text: componentID + '_error_text',
        label: componentID + '_label',
        label_text: componentID + '_label_text',
        focus: componentID + '__focus'
    },

    wrapperAttr: {}
}

const setDefaults = (customDefaults: Props) => Object.assign(defaults, customDefaults)

interface ComponentInputAttributes extends RefAttributes<HTMLInputElement>, InputHTMLAttributes<HTMLInputElement> {}

//[email, password, search, tel, text, url, (textarea)]

const Input = (props: Props) => {
    let theme = props.theme
        ?   Object.assign({}, defaults.theme, props.theme)
        :   defaults.theme;

    let { className, wrapperAttr, inputAttr, label, placeholder, value, errorMsg, type,
        disabled, autofocus, onBlur, onChange, onFocus } = Object.assign({}, defaults, props)


    let _className = `${theme.input} `
    className && (_className += className);
    (wrapperAttr as CurrentWrapperAttributes).error = errorMsg ? '' : null;
    (wrapperAttr as CurrentWrapperAttributes).filled = value ? '' : null;
    

    let _inputAttr: ComponentInputAttributes = Object.assign({}, inputAttr, {
        className: theme.field,
        placeholder, onFocus, onBlur, disabled
    })
    
    if (onChange) {
        _inputAttr.onChange = e => onChange!(e.target.value, e)
        _inputAttr.value = value
    } else {
        _inputAttr.defaultValue = value
    }
    

    if (autofocus) {
        _inputAttr.ref = useRef<HTMLInputElement>(null)
        
        useEffect(() => {
            (_inputAttr.ref as MutableRefObject<HTMLInputElement>).current.focus()
        }, [])
    }

    let InputTag = 'input'
    if (type) {
        if (type == 'textarea') {
            InputTag = type
            _className += ` ${theme.textarea}`
        } else {
            _inputAttr.type = type
        }
    }
    
    let inputElement = <InputTag {..._inputAttr} />;
    
    label && (inputElement = (
        <label className={theme.label}>
            <span className={theme.label_text} children={label} />

            { inputElement }
        </label>
    ))
    

    return (
        <div {...wrapperAttr} className={_className}
            onFocus={e => e.currentTarget.classList.add(theme.focus)}
            onBlur={e => e.currentTarget.classList.remove(theme.focus)}>

            { inputElement }

            { wrapperAttr.children && (
                <span className={theme.extra} children={wrapperAttr.children} />
            )}
            
            { errorMsg && <span className={theme.error_text} children={errorMsg} /> }
        </div>
    )
}
Input.id = componentID


export { setDefaults }
export default Input