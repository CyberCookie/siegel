import React, { useState } from 'react'

import NumberPicker from '../../../_form/NumberPicker'
import { Props } from '../../../_form/NumberPicker/types'

import s from './styles.sass'


const theme = {
}

const Demo = () => {
    const [ value, setValue ] = useState('')

    const props: Props = {
        theme, value,
        placeholder: 'placeholder',
        onChange(value) {
            setValue(value)
        }
    }


    return <>
        <h1>{NumberPicker.ID}</h1>

        <h2>simple</h2>
        <NumberPicker {...props} />

        <h2>with step[0.1] limit[0 - 10] precision[2]</h2>
        <NumberPicker {...props} step={0.1} min={0} max={10} precision={2} />

        <h2>disabled input, step[1]</h2>
        <NumberPicker {...props} step={1} disableInput />

        <h2>disabled</h2>
        <NumberPicker {...props} step={1} disabled />
    </>
}
Demo.id = NumberPicker.ID;


export default Demo