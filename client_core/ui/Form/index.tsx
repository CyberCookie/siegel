import React, { useState } from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import component from '../_internals/component'
import inputID from '../Input/id'
import checkboxID from '../Checkbox/id'

import type { CoreUIComponentWithDefaults } from '../_internals/types'
import type { Component as _Input, Props as InputProps } from '../Input/types'
import type { Component as _NumberPicker, Props as NumberPickerProps } from '../NumberPicker/types'
import type { Component as _DropdownSearch, Props as DropdownSearchProps } from '../DropdownSearch/types'
import type { Component as _Select, Props as SelectProps } from '../Select/types'
import type { Component as _Toggle, Props as ToggleProps } from '../Toggle/types'
import type { Component as _Checkbox, Props as CheckboxProps } from '../Checkbox/types'
import type { Component as _Calendar, Props as CalendarProps } from '../Calendar/types'
import type { Component as _Ranger, Props as RangerProps } from '../Ranger/types'
import type { Component as _Stepper, Props as StepperProps } from '../Stepper/types'
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

const onFormElementChange = (commonChangeProps: CommonChangeProps, value: string) => {
    const { validators, name, formStore } = commonChangeProps
    const [ values, setValues ] = formStore

    const errorMsg = validators.length ? validate(value, validators) : ''

    values[name] = { value, errorMsg }
    setValues({ ...values })
}

function parseInputs(inputs: Props['inputs']) {

    const result: any[] = []

    // return inputs.map(inputData => {
    //     if (Array.isArray(inputData)) {
    //         const elementsArray = getFormElements(inputData)
    //     } else {
    //         const {
    //             Component, name, disabledIf, props, validators
    //         } = inputData

    //         switch(Component.ID) {
    //             case inputID:
    //                 const InputEl = Component as CoreUIComponentWithDefaults<_Input>
    //                 const inputProps = props as InputProps
    //                 return <InputEl key={ name } { ...inputProps } />

    //             case checkboxID:
    //                 return <CheckboxEl key={ name } { ...checkboxProps } />

    //             default:
    //                 return ''
    //         }
    //     }
    // })


    return result
}

const Form: Component = component(
    componentID,
    {
        theme: {
            root: '',
            inputs_row: '',
            rows_block: ''
        }
    },
    props => {

        const { onSubmit, className, rootTagAttributes, theme, inputs } = props

        const formStore: FormStore = useState({})
        const [ values, setValues ] = formStore

        const inputsParsedData = parseInputs(inputs)

        let formProps = {
            className,
            onSubmit(e: React.FormEvent<HTMLFormElement>) {
                e.stopPropagation()
                e.preventDefault()

                onSubmit(values, e)
            },
            children: []
        }
        formProps = resolveTagAttributes(formProps, rootTagAttributes)

        // const ifDisabledBy = (name: string) => {
        //     const formElementData = inputs[name]

        //     return formElementData
        //         ?   !!validate(
        //                 values[name]?.value || '',
        //                 formElementData.validators || []
        //             )
        //         :   false
        // }

        // function getFormElements() {
        //     const result: JSX.Element[] = []

            // for (const name in inputs) {
            //     const { Component, props, validators = [], disabledIf } = inputs[name]
            //     const { value = '', errorMsg = '' } = values[name] || {}

            //     const disabled = disabledIf
            //         ?   typeof disabledIf == 'string'
            //             ?   ifDisabledBy(disabledIf)
            //             :   disabledIf.some(ifDisabledBy)
            //         :   false

            //     const changeCommonParams = { validators, name, formStore }

            //     let ComponentToPush: JSX.Element
            //     if (Component.ID == inputID) {
            //         // const onChange = onInputChange.bind(null, validators, name)
            //         const extraProps = {
            //             value, name, disabled,
            //             errorMsg: (props as InputProps).errorMsg || errorMsg,
            //             onChange(value) {
            //                 onFormElementChange(changeCommonParams, value)
            //             },
            //             onBlur(e) {
            //                 onFormElementChange(changeCommonParams, (e.target as HTMLInputElement).value)
            //             }
            //         } as InputProps

            //         ComponentToPush = React.createElement(Component as _Input, Object.assign(extraProps, props))

            //     } else if (Component.ID == checkboxID) {
            //         const extraProps = {
            //             value, disabled,
            //             onChange(value) {
            //                 values[name] = { value }
            //                 setValues({ ...values })
            //             }
            //         } as CheckboxProps

            //         ComponentToPush = React.createElement(Component as _Checkbox, Object.assign(extraProps, props))
            //     }


            //     result.push(ComponentToPush!)

            //     //TODO:
            //     // result.push( <Component {...Object.assign(extraProps, props)} key={name} /> )
            // }


        //     return result
        // }


        return <form { ...formProps } />
    }
)


export default Form
export { componentID }
export type { Component, Props }