import React, { useState } from 'react'

import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import inputID from '../Input/id'
import checkboxID from '../Checkbox/id'
import type { Component as _Input, Props as InputProps } from '../Input/types'
import type { Component as _Checkbox, Props as CheckboxProps } from '../Checkbox/types'
import type {
    Component, Props,
    ValueStateValue, Validator, FormStore, CommonChangeProps
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

const Form: Component = component(
    componentID,
    {},
    props => {

        const { onSubmit, className, rootTagAttributes, inputs } = props

        const formStore: FormStore = useState({})
        const [ values, setValues ] = formStore

        let formProps = {
            className,
            onSubmit(e: React.FormEvent<HTMLFormElement>) {
                e.stopPropagation()
                e.preventDefault()

                onSubmit(values, e)
            },
            children: getFormElements()
        }
        rootTagAttributes && (formProps = mergeTagAttributes(formProps, rootTagAttributes))

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

                const disabled = disabledIf
                    ?   typeof disabledIf == 'string'
                        ?   ifDisabledBy(disabledIf)
                        :   disabledIf.some(ifDisabledBy)
                    :   false


                if (Component.ID == inputID) {
                    // const onChange = onInputChange.bind(null, validators, name)

                    const changeCommonParams = { validators, name, formStore }

                    const extraProps = {
                        value, name, disabled,
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
                        value, disabled,
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
)


export default Form
export { componentID }
export type { Component, Props }