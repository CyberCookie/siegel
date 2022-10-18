import React, { useState } from 'react'

import { NumberPicker, NumberPickerProps } from 'app/components'


const Demo = () => {
    const [ value, setValue ] = useState<string | number>('0')
    const props: NumberPickerProps = {
        value,
        placeholder: 'placeholder',
        onChange({ value }) {
            setValue(value)
        }
    }

    return <>
        <h2 children='simple' />
        <NumberPicker { ...props } />

        <h2 children='with step[0.1] limit[-2 - 10] precision[2] autofocus' />
        <NumberPicker { ...props } step={ 0.1 } min={ -2 } max={ 10 } precision={ 2 } autofocus />

        <h2 children='with step[3.5] precision[3]' />
        <NumberPicker { ...props } step={ 3.5 } precision={ 3 } />

        <h2 children='disabled input, step[1], label' />
        <NumberPicker { ...props } step={ 1 } disabledInput label='some label' />

        <h2 children='disabled' />
        <NumberPicker { ...props } step={ 1 } disabled />
    </>
}
Demo.coreSrcDirName = 'NumberPicker'


export default Demo