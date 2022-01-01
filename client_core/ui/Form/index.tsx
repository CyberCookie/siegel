import React, { useState } from 'react'

import extractProps from '../_internals/props_extract'
import inputID from '../Input/id'
import checkboxID from '../Checkbox/id'
import type { Component as _Input, Props as InputProps } from '../Input/types'
import type { Component as _Checkbox, Props as CheckboxProps } from '../Checkbox/types'
import type {
    Component, ValueStateValue, Validator, FormStore, CommonChangeProps, MergedProps,
    Props
} from './types'


const componentID = '-ui-form'

const validate = (value: ValueStateValue, validators: Validator[]) => {
    for (let i = 0, l = validators.length; i < l; i++) {
        const { validate, msg } = validators[i]
        if (!validate(value)) return msg
    }

    return ''
}

const onInputChange = (commonChangeProps: CommonChangeProps, value: string) => {
    const { validators, name, formStore } = commonChangeProps
    const [ values, setValues ] = formStore

    const errorMsg = validators.length ? validate(value, validators) : ''

    values[name] = { value, errorMsg }
    setValues({ ...values })
}

const Form: Component = (props, noDefaults) => {
    const { onSubmit, className, attributes, inputs } = noDefaults
        ?   extractProps(Form.defaults, props, false)
        :   (props as MergedProps)


    const formStore: FormStore = useState({})
    const [ values, setValues ] = formStore

    const formProps = Object.assign({
        className,
        onSubmit(e: React.FormEvent<HTMLFormElement>) {
            e.stopPropagation()
            e.preventDefault()

            onSubmit(values, e)
        },
        children: getFormElements()
    }, attributes)

    const ifDisabledBy = (name: string) => {
        const formElementData = inputs[name]

        return formElementData
            ?   !!validate(
                    values[name]?.value || '',
                    formElementData.validators || []
                )
            :   false
    }

    function getFormElements() {
        const result: JSX.Element[] = []

        for (const name in inputs) {
            const { Component, props, validators = [], disabledIf } = inputs[name]
            const { value = '', errorMsg = '' } = values[name] || {}

            let ComponentToPush: JSX.Element

            const dissabled = disabledIf
                ?   typeof disabledIf == 'string'
                    ?   ifDisabledBy(disabledIf)
                    :   disabledIf.some(ifDisabledBy)
                :   false


            if (Component.ID == inputID) {
                // const onChange = onInputChange.bind(null, validators, name)

                const changeCommonParams = { validators, name, formStore }

                const extraProps = {
                    value, name, dissabled,
                    errorMsg: (props as InputProps).errorMsg || errorMsg,
                    onChange(value) {
                        onInputChange(changeCommonParams, value)
                    },
                    onBlur(e) {
                        onInputChange(changeCommonParams, (e.target as HTMLInputElement).value)
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


    return <form { ...formProps } />
}
Form.defaults = {}
Form.ID = componentID


export { componentID }
export default Form
export type { Props }