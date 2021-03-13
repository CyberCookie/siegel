import React, { useState } from 'react'
import { Props } from 'siegel-ui/_form/Select/types'

import { Select, selectTheme } from 'app/components'


import s from './styles.sass'

const Demo = () => {
    const [ selectedOption, setOption ] = useState(0)

    const props: Props = {
        placeholder: 'placeholder',
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

        <h2>filter selected: false</h2>
        <Select {...props} filterSelected={false} />

        <h2>disabled</h2>
        <Select {...props} disabled />
    </>
}
Demo.id = Select.ID;


export default Demo