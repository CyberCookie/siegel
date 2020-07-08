import React, { useState } from 'react'

import Input from '../../../_form/Input'
import { Props } from '../../../_form/Input/types'
import { icon } from '../../icons'

import s from './styles.sass'


const theme: Props['theme'] = {
    root: s.wrapper,
    field: s.field,
    textarea: s.textarea,
    label: s.label,
    label_text: s.label_text,
    error_text: s.error_text,
    extra: s.extra,
    _error: s._error,
    _touched: s._touched,
    _focused: s._focused
}

const Demo = () => {
    const [ inputValue, setInputValue ] = useState('')

    const props: Props = {
        theme,
        value: inputValue,
        placeholder: 'placeholder',
        onChange(value) {
            setInputValue(value)
        }
    }


    return <>
        <h1>{Input.ID}</h1>

        <h2>simple</h2>
        <Input {...props} />

        <h2>with error, label and extra content as icon, autofocus</h2>
        <Input {...props}
            autofocus
            errorMsg={inputValue.length < 5 ? 'too short' : ''}
            attributes={{ children: icon }}
            label='some_label' />
        
        <h2>textfield</h2>
        <Input {...props} label='text field' type='textarea' />

        <h2>disabled</h2>
        <Input {...props} disabled />
    </>
}
Demo.id = Input.ID;


export default Demo