import React, { useState } from 'react'

import { Checkbox, CheckboxProps } from 'app/components'


const Demo = () => {
    const [ isChecked, setChecked ] = useState(false)

    const props: CheckboxProps = {
        value: isChecked,
        onChange(value) { setChecked(value) }
    }


    return <>
        <h1>{Checkbox.ID}</h1>

        <h2>simple</h2>
        <h3>checked: {isChecked + ''}</h3>
        <Checkbox {...{ ...props, icon: false }} />

        <h2>with label</h2>
        <Checkbox {...{ ...props, icon: false }} disabled label='Some label' />

        <h2>with label and icon</h2>
        <Checkbox {...props} label='Some label' />

        <h2>disabled</h2>
        <Checkbox {...props} disabled />
    </>
}
Demo.id = Checkbox.ID


export default Demo