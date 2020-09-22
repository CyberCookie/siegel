import React, { useState } from 'react'

import Checkbox from 'siegel-ui/_form/Checkbox'
import { Props } from 'siegel-ui/_form/Checkbox/types'
import { check } from '../../icons'

import s from './styles.sass'


const theme: Props['theme'] = {
    label: s.label,
    checkbox: s.checkbox,
    _disabled: s.disabled,
    _checked: s.checked,
    with_icon_wrapper: s.with_icon_wrapper,
    root: s.root
}

const Demo = () => {
    const [ isChecked, setChecked ] = useState(false)

    const props: Props = {
        value: isChecked,
        onChange(value) { setChecked(value) },
        theme
    }


    return <>
        <h1>{Checkbox.ID}</h1>

        <h2>simple</h2>
        <h3>checked: {isChecked + ''}</h3>
        <Checkbox {...props} />

        <h2>with icon and label</h2>
        <Checkbox {...props} label='Some label' icon={check} />

        <h2>disabled</h2>
        <Checkbox {...props} disabled />
    </>
}
Demo.id = Checkbox.ID;


export { theme }
export default Demo