import React, { useState } from 'react'

import { extractProps } from '../../ui_utils'
import inputID from '../Input/id'
import checkboxID from '../Checkbox/id'
import type { _Input, Props as InputProps } from '../Input/types'
import type { _Checkbox, Props as CheckboxProps } from '../Checkbox/types'
import type { _Form, ValuesState, ValueStateValue, Validator } from './types'


const componentID = '-ui-form'

const Form: _Form = (props, noDefaults) => {
    const { onSubmit, className, attributes, inputs } = noDefaults
        ?   extractProps(Form.defaults, props)
        :   (props as _Form['defaults'] & typeof props)
    

    const [ values, setValues ] = useState({} as ValuesState)

    const formProps = Object.assign({
        className,
        onSubmit(e: React.FormEvent<HTMLFormElement>) {
            e.stopPropagation()
            e.preventDefault()
            
            onSubmit(values, e)
        },
        children: getFormElements()
    }, attributes)


    const onInputChange = (validators: Validator[], name: string, value: string) => {
        const errorMsg = validators.length ? validate(value, validators) : ''

        values[name] = { value, errorMsg }
        setValues({ ...values })
    }


    const validate = (value: ValueStateValue, validators: Validator[]) => {
        for (let i = 0, l = validators.length; i < l; i++) {
            const { validate, msg } = validators[i]
            if (!validate(value)) return msg
        }

        return ''
    }

    const ifDisabledBy = (name: string) => {
        const nameStateData = values[name] || {}
        const value = nameStateData.value || ''
        const formElementData = inputs[name]

        return formElementData
            ?   !!validate(value, formElementData.validators || [])
            :   false
    }

    function getFormElements() {
        const result: JSX.Element[] = []

        for (const name in inputs) {
            const { Component, props, validators = [], disabledIf } = inputs[name]
            const { value = '', errorMsg = '' } = values[name] || {}

            let ComponentToPush: JSX.Element;

            const dissabled = disabledIf
                ?   typeof disabledIf == 'string'
                    ?   ifDisabledBy(disabledIf)
                    :   disabledIf.some(ifDisabledBy)
                :   false;

            
            if (Component.ID == inputID) {
                const onChange = onInputChange.bind(null, validators, name)
                
                const extraProps = {
                    value, name, onChange, dissabled,
                    errorMsg: (props as InputProps).errorMsg || errorMsg,
                    onBlur(e) {
                        onChange((e.target as HTMLInputElement).value)
                        return false
                    }
                } as InputProps

                ComponentToPush = React.createElement(Component as _Input, Object.assign(extraProps, props))
            } else if (Component.ID == checkboxID) {
                const extraProps = {
                    value, dissabled,
                    onChange(value) {
                        values[name] = { value }
                        setValues({ ...values })
                    }
                } as CheckboxProps

                ComponentToPush = React.createElement(Component as _Checkbox, Object.assign(extraProps, props))
            }

            
            result.push(ComponentToPush!)

            //TODO:
            // result.push( <Component {...Object.assign(extraProps, props)} key={name} /> )
        }


        return result
    }


    return <form {...formProps} />
}
Form.defaults = {
    className: componentID
}
Form.ID = componentID;


export default Form