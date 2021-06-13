import React, { useState } from 'react'

import { Select, SelectProps, icons } from 'app/components'


type DemoSelectState = number | undefined
type DempSelectStore = [ DemoSelectState, React.Dispatch<React.SetStateAction<DemoSelectState>> ]

type DemoSelectProps = SelectProps<DemoSelectState>


const getSelectDisplayValue = ({ title }: DemoSelectProps['options'][number]) => 'selected - ' + title

const Demo = () => {
    const [ selectedOption, setOption ] = useState(undefined) as DempSelectStore

    const props: DemoSelectProps = {
        placeholder: 'placeholder',
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
        onChange(value) { setOption(value) }
    }


    return <>
        <h1>{Select.ID}</h1>

        <h2>simple</h2>
        <Select { ...props } />

        <h2>with label and displayTitle processing</h2>
        <Select { ...props } label='some label' getDisplayValue={getSelectDisplayValue} />

        <h2>filter selected: false; with reset</h2>
        <Select { ...props } filterSelected={false} resetIcon={icons.close} />

        <h2>disabled</h2>
        <Select { ...props } disabled />
    </>
}
Demo.id = Select.ID


export default Demo