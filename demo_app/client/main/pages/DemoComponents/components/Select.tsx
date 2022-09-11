import React, { useState } from 'react'

import { Select, SelectProps, icons } from 'app/components'


type DemoSelectState = number | undefined
type DemoSelectStore = ReactStore<DemoSelectState>

type DemoSelectProps = SelectProps<DemoSelectState>


const { ID } = Select

const getSelectDisplayValue = ({ title }: DemoSelectProps['options'][number]) => 'selected - ' + title

const Demo = () => {
    const [ selectedOption, setOption ] = useState() as DemoSelectStore

    const props: DemoSelectProps = {
        placeholder: 'placeholder',
        selected: selectedOption,
        options: [
            { value: 1, title: 'option 1' },
            { value: 2, title: 'option option 2', disabled: true },
            { value: 3, title: 'option 3' },
            { value: 4, title: 'option 4' },
            { value: 5, title: 'disabled option 5', disabled: true }
        ],
        onChange(value) { setOption(value) }
    }


    return <>
        <h2 children='simple' />
        <Select { ...props } />

        <h2 children='with label and displayTitle processing' />
        <Select { ...props } label='some label' getDisplayValue={ getSelectDisplayValue } />

        <h2 children='filter selected: false; with reset' />
        <Select { ...props } listSelectedOption={ false } resetIcon={ icons.close } />

        <h2 children='disabled' />
        <Select { ...props } disabled />
    </>
}
Demo.id = ID
Demo.coreSourcesPath = 'Select'


export default Demo