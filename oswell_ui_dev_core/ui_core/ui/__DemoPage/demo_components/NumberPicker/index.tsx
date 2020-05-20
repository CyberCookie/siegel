import React, { useState } from 'react'

import NumberPicker from '../../../_form/NumberPicker'
import { Props } from '../../../_form/NumberPicker/types'
import { chevron } from '../../icons'

import s from './styles.sass'


const theme = {
    root: s.number_picker,
    field: s.field,
    label: s.label,
    controls: s.controls,
    button_minus: s.minus_icon,
    _disabled: s._disabled,
    _focused: s._focused
}

const Demo = () => {
    const [ value, setValue ] = useState('')

    const props: Props = {
        theme, value,
        placeholder: 'placeholder',
        minusIcon: chevron,
        plusIcon: chevron,
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

        <h2>disabled input, step[1], label</h2>
        <NumberPicker {...props} step={1} disableInput label='some label' />

        <h2>disabled</h2>
        <NumberPicker {...props} step={1} disabled />
    </>
}
Demo.id = NumberPicker.ID;


export default Demo