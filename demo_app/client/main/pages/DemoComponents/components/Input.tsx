import React, { useState } from 'react'
import maskProcessor from 'siegel-ui/Input/mask_processor'

import { icons, Input, InputProps } from 'app/components'


const { ID } = Input

const Demo = () => {
    const [ inputValue, setInputValue ] = useState('')

    const props: InputProps = {
        value: inputValue,
        placeholder: 'placeholder',
        onChange(value) {
            setInputValue(value)
        }
    }


    return <>
        <h2 children='simple' />
        <Input { ...props } />

        <h2 children='with error, label and extra content as icon, autofocus' />
        <Input { ...props } autofocus
            errorMsg={ inputValue.length < 5 ? 'too short' : '' }
            rootTagAttributes={{ children: icons.search }}
            label='some_label' />

        <h2 children='textfield' />
        <Input { ...props } label='text field' type='textarea' />

        <h2 children='With mask and number regexp validation' />
        <Input { ...props } regexp={ /^\d*$/ }
            mask={{
                processor: maskProcessor,
                pattern: '== +* (****) *** - ** - ** ==',
                patternValueChar: '*',
                valuePlaceholderChar: '_'
            }} />

        <h2 children='disabled' />
        <Input { ...props } disabled />
    </>
}
Demo.id = ID
Demo.coreSourcesPath = 'Input'


export default Demo