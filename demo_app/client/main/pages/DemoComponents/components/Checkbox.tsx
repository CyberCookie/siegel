import React, { useState } from 'react'

import { Checkbox, CheckboxProps } from 'app/components'


const Demo = () => {
    const [ isChecked, setChecked ] = useState(false)

    const props: CheckboxProps = {
        value: isChecked,
        onChange(value) {
            setChecked(value)
        }
    }


    return <>
        <h2 children='simple' />
        <h3 children={ `checked: ${isChecked.toString()}` } />
        <Checkbox { ...{ ...props, icon: false } } />

        <h2 children='with label' />
        <Checkbox { ...{ ...props, icon: false } } disabled label='Some label' />

        <h2 children='with label and icon' />
        <Checkbox { ...props } label='Some label' />

        <h2 children='disabled' />
        <Checkbox { ...props } disabled />
    </>
}
Demo.coreSrcDirName = 'Checkbox'


export default Demo