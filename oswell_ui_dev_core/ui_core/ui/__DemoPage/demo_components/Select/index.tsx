import React, { useState } from 'react'

import Select from '../../../_form/Select'
import { chevron } from '../../icons'

import s from './styles.sass'


const Demo = () => {
    const [ selectedOption, setOption ] = useState(0)

    const props = {
        theme: {
            root: s.select,
            label: s.label,
            title: s.title,
            options: s.options,
            option: s.option,
            _active: s._active,
            _disabled: s._disabled,
            _option_active: s._option_active,
            _option_disabled: s._option_disabled
        },
        dropdownIcon: chevron,
        displayValue: selectedOption && `selected - ${selectedOption}`,
        selected: selectedOption,
        options: [
            {
                value: 1,
                title: 'option 1'
            },
            {
                value: 2,
                title: 'option 2'
            },
            {
                value: 3,
                title: 'disabled option 3',
                disabled: true
            }
        ],
        onChange(value: number) { setOption(value) }
    }


    return <>
        <h1>{Select.ID}</h1>

        <h2>simple</h2>
        <Select {...props} />

        <h2>with label</h2>
        <Select {...props} label='some label' />

        <h2>disabled</h2>
        <Select {...props} disabled />
    </>
}
Demo.id = Select.ID;


export default Demo