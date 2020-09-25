import React, { useState } from 'react'
import { Props } from 'siegel-ui/_form/NumberPicker/types'

import { NumberPicker } from 'app/components'


const Demo = () => {
    const [ value, setValue ] = useState('')
    const props: Props = {
        value,
        placeholder: 'placeholder',
        onChange(value) {
            setValue(value)
        }
    }

    return <>
        <h1>{NumberPicker.ID}</h1>

        <h2>simple</h2>
        <NumberPicker {...props} />

        <h2>with step[0.1] limit[0 - 10] precision[2] autofocus</h2>
        <NumberPicker {...props} step={0.1} min={0} max={10} precision={2} autofocus />

        <h2>disabled input, step[1], label</h2>
        <NumberPicker {...props} step={1} disabledInput label='some label' />

        <h2>disabled</h2>
        <NumberPicker {...props} step={1} disabled />
    </>
}
Demo.id = NumberPicker.ID;


export default Demo