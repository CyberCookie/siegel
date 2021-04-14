import React, { useState } from 'react'
import maskProcessor from 'siegel-ui/_form/Input/mask_processor'

import { icons, Input, InputProps } from 'app/components'


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
        <h1>{Input.ID}</h1>

        <h2>simple</h2>
        <Input {...props} />

        <h2>with error, label and extra content as icon, autofocus</h2>
        <Input {...props}
            autofocus
            errorMsg={inputValue.length < 5 ? 'too short' : ''}
            attributes={{ children: icons.search }}
            label='some_label' />
        
        <h2>textfield</h2>
        <Input {...props} label='text field' type='textarea' />

        <h2>With mask and number regexp validation</h2>
        <Input {...props} regexp={/^\d*$/}
            mask={{
                processor: maskProcessor,
                pattern: '== (****) ** - ** - ** ==',
                patternValueChar: '*',
                valuePlaceholderChar: '_'
            }} />
        
        <h2>disabled</h2>
        <Input {...props} disabled />
    </>
}
Demo.id = Input.ID;


export default Demo