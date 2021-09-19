import React, { useState } from 'react'

import { Select, SelectProps, icons } from 'app/components'


type DemoSelectState = number | undefined
type DempSelectStore = [ DemoSelectState, React.Dispatch<React.SetStateAction<DemoSelectState>> ]

type DemoSelectProps = SelectProps<DemoSelectState>


const { ID } = Select

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
        <h1 children={ ID } />

        <h2 children='simple' />
        <Select { ...props } />

        <h2 children='with label and displayTitle processing' />
        <Select { ...props } label='some label' getDisplayValue={ getSelectDisplayValue } />

        <h2 children='filter selected: false; with reset' />
        <Select { ...props } filterSelected={ false } resetIcon={ icons.close } />

        <h2 children='disabled' />
        <Select { ...props } disabled />
    </>
}
Demo.id = ID


export default Demo