import React, { useState } from 'react'

import './styles'


const Form = ({ onSubmit, className, wrapperAttr = {}, inputs }) => {
    const onInputChange = (validators, name, value) => {
        let errorMsg = validators.length ? validate(value, validators) : ''

        values[name] = { value, errorMsg }
        setValues({ ...values })
    }

    const onCheckboxChange = (name, value) => {
        values[name] = { value }
        setValues({ ...values })
    }

    const validate = (value, validators) => {
        for (let i = 0, l = validators.length; i < l; i++) {
            let { validate, msg } = validators[i]

            if (!validate(value)) {
                return msg
            }
        }

        return ''
    }

    const ifDisabledBy = name => {
        let nameStateData = values[name] || {}
        let value = nameStateData.value || ''
        let formElementData = inputs[name]

        if (formElementData) {
            let validators = formElementData.validators || []
            return !!validate(value, validators)
        }

        return false
    }

    const getFormElements = () => {
        let result = []

        for (let name in inputs) {
            let { Component, props, validators = [], disabledIf } = inputs[name]
            let extraProps = {}
            let value = values[name] ? values[name].value : ''

            if (Component.id == '-ui-input') {
                let onChange = onInputChange.bind(null, validators, name)
    
                extraProps = {
                    value, name, onChange,
                    errorMsg: props.errorMsg || (values[name] ? values[name].errorMsg : ''),
                    onBlur(e) {
                        onChange(e.target.value)
                        return false
                    }
                }
            } else if (Component.id == '-ui-checkbox') {
                extraProps = {
                    value,
                    onChange: onCheckboxChange.bind(null, name)
                }
            }

            if (disabledIf) {
                extraProps.disabled = typeof disabledIf == 'string'
                    ?   ifDisabledBy(disabledIf)
                    :   disabledIf.some(ifDisabledBy)
            }

            let _props = Object.assign({}, props, extraProps)
            
            result.push(<Component key={name} {..._props} />)
        }

        return result
    }


    let [ values, setValues ] = useState({})

    let _className = '-ui-form '
    className && (_className += className)

    let formProps = Object.assign({}, wrapperAttr, {
        className: _className,
        onSubmit(e) {
            e.stopPropagation()
            e.preventDefault()
            
            onSubmit(values)
        },
        children: getFormElements()
    })

    return <form {...formProps} />
}


export default Form